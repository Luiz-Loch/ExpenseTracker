import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { Expense } from '../expense/entities/expense.entity';
import { SummaryReport } from './types/summary.types';
import { MonthlyReport } from './types/monthly.type';
import { CategoryResponseDto } from 'src/category/dto/response-category.dto';
import { ExpenseType } from '../expense/enums/expense-type.enum';
import { CurrencyConfig } from 'src/common/money/money.util';
import { Currency } from '../expense/enums/currency.enum';
import { SummaryQueryDto } from './dto/summary.query.dto';
import { Totals } from './types/totals.type';
import { ByCategoryReport } from './types/by-category.type';
import { ByCategoryQueryDto } from './dto/by-category.query.dto';
import { MonthlyQueryDto } from './dto/monthly.query.dto';

@Injectable()
export class ReportService {

  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  public async summary(userId: string, query: SummaryQueryDto): Promise<SummaryReport> {
    await this.ensureUserExists(userId);
    const currency: Currency = query.currency ?? Currency.BRL;
    const { from, to } = this.validateAndNormalizeRange(query.from, query.to);

    // base query with filters applied, to be reused in the different report sections
    const baseQb = this.buildBaseExpenseQuery(userId, currency, from, to, query.type);

    // totals:
    // ******************************
    const totalsRow = await baseQb
      .clone()
      .select('COUNT(*)', 'count')
      .addSelect(
        `COALESCE(SUM(CASE WHEN e.type = :incomeType THEN e.amount_cents ELSE 0 END), 0)`,
        'incomeCents',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN e.type = :expenseType THEN e.amount_cents ELSE 0 END), 0)`,
        'expenseCents',
      )
      .setParameters({
        incomeType: ExpenseType.INCOME,
        expenseType: ExpenseType.EXPENSE,
      })
      .getRawOne<{ count: string; incomeCents: string; expenseCents: string }>() ?? {
      count: '0',
      incomeCents: '0',
      expenseCents: '0',
    };

    const totals = this.totalsFromRow(totalsRow, currency);

    // byCategory:
    // ******************************
    const byCategoryRows = await baseQb
      .clone()
      .leftJoin('e.category', 'c')
      .select('c.id', 'categoryId')
      .addSelect(
        `COALESCE(SUM(CASE WHEN e.type = :incomeType THEN e.amount_cents ELSE 0 END), 0)`,
        'incomeCents',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN e.type = :expenseType THEN e.amount_cents ELSE 0 END), 0)`,
        'expenseCents',
      )
      .addSelect('COUNT(*)', 'count')
      .setParameters({
        incomeType: ExpenseType.INCOME,
        expenseType: ExpenseType.EXPENSE,
      })
      .groupBy('c.id')
      .getRawMany<{ categoryId: string | null; incomeCents: string; expenseCents: string; count: string }>();

    // filter all non-null categoryIds from the report
    const categoryIds: Array<string> = byCategoryRows
      .map((r) => r.categoryId)
      .filter((id): id is string => !!id);

    // load all categories that are part of the report in a single query
    const categories: Array<Category> = categoryIds.length
      ? await this.categoryRepository.find({
        where: {
          id: In(categoryIds),
          user: { id: userId },
        }
      }) : [];

    // create a map of categoryId -> Category
    const categoryMap = new Map<string, CategoryResponseDto>();
    for (const c of categories) {
      categoryMap.set(c.id, new CategoryResponseDto(c));
    }

    const byCategory: SummaryReport['byCategory'] = byCategoryRows.map((r) => {
      const totals: Totals = this.totalsFromRow(r, currency);

      return {
        category: r.categoryId ? categoryMap.get(r.categoryId) ?? null : null,
        totals
      };
    });

    return {
      range: { from, to },
      currency,
      totals,
      byCategory,
    };
  }

  public async monthly(userId: string, query: MonthlyQueryDto): Promise<MonthlyReport> {
    await this.ensureUserExists(userId);

    const currency: Currency = query.currency ?? Currency.BRL;
    const { from, to } = this.validateAndNormalizeRange(`${query.year}-01-01`, `${query.year}-12-31`);

    const baseQb = this.buildBaseExpenseQuery(userId, currency, from, to);

    const rows = await baseQb
      .clone()
      .select(`EXTRACT(MONTH FROM e.spent_at)`, 'month')
      .addSelect(
        `COALESCE(SUM(CASE WHEN e.type = :incomeType THEN e.amount_cents ELSE 0 END), 0)`,
        'incomeCents',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN e.type = :expenseType THEN e.amount_cents ELSE 0 END), 0)`,
        'expenseCents',
      )
      .addSelect('COUNT(*)', 'count')
      .setParameters({
        incomeType: ExpenseType.INCOME,
        expenseType: ExpenseType.EXPENSE,
      })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany<{ month: string; incomeCents: string; expenseCents: string; count: string }>();

    // Month to totals
    const byMonth = new Map<number, Totals>();
    for (const r of rows) {
      const month = Number(r.month); // 1..12
      const totals: Totals = this.totalsFromRow(r, currency);
      byMonth.set(month, totals);
    }

    // generate 12 months, even empty ones
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return {
        month,
        totals: byMonth.get(month) ?? this.makeTotals(0, 0, 0),
      };
    });

    return {
      year: query.year,
      currency,
      months,
    };

  }

  public async byCategory(userId: string, query: ByCategoryQueryDto): Promise<ByCategoryReport> {
    await this.ensureUserExists(userId);
    const currency: Currency = query.currency ?? Currency.BRL;
    const { from, to } = this.validateAndNormalizeRange(query.from, query.to);

    // base query with filters applied, to be reused in the different report sections
    const baseQb = this.buildBaseExpenseQuery(userId, currency, from, to, query.type);

    const rows = await baseQb
      .clone()
      .leftJoin('e.category', 'c')
      .select('c.id', 'categoryId')
      .addSelect(
        `COALESCE(SUM(CASE WHEN e.type = :incomeType THEN e.amount_cents ELSE 0 END), 0)`,
        'incomeCents',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN e.type = :expenseType THEN e.amount_cents ELSE 0 END), 0)`,
        'expenseCents',
      )
      .addSelect('COUNT(*)', 'count')
      .setParameters({
        incomeType: ExpenseType.INCOME,
        expenseType: ExpenseType.EXPENSE,
      })
      .groupBy('c.id')
      .getRawMany<{ categoryId: string | null; incomeCents: string; expenseCents: string; count: string }>();


    const categoryIds = rows.map(r => r.categoryId).filter((id): id is string => !!id);


    const categories = categoryIds.length
      ? await this.categoryRepository.find({
        where: { id: In(categoryIds), user: { id: userId } },
      })
      : [];

    const categoryMap = new Map<string, CategoryResponseDto>();
    for (const c of categories) categoryMap.set(c.id, new CategoryResponseDto(c));

    const items = rows.map((r) => {
      const totals: Totals = this.totalsFromRow(r, currency);

      return {
        category: r.categoryId ? (categoryMap.get(r.categoryId) ?? null) : null,
        totals,
      };
    });

    return {
      range: { from, to },
      currency,
      items,
    };

  }

  // ------------------------
  // helpers
  // ------------------------

  private async ensureUserExists(userId: string): Promise<void> {
    const exists: boolean = await this.userRepository.existsBy({ id: userId });

    if (!exists) {
      throw new BadRequestException('User not found');
    }
  }

  private validateAndNormalizeRange(fromStr: string, toStr: string): { from: Date; to: Date } {
    const from: Date = this.parseDateOnly(fromStr, true);
    const to: Date = this.parseDateOnly(toStr, false);

    if (from.getTime() > to.getTime()) {
      throw new BadRequestException('Invalid format: from cannot be greater than to');
    }

    return { from, to };
  }

  private parseDateOnly(value: string, startOfDay: boolean): Date {
    // expects YYYY-MM-DD
    const [y, m, d] = value.split('-').map(Number);
    if (!y || !m || !d) {
      throw new BadRequestException(`Invalid date: ${value}`);
    }

    return startOfDay
      ? new Date(y, m - 1, d, 0, 0, 0, 0)
      : new Date(y, m - 1, d, 23, 59, 59, 999);
  }

  private makeTotals(income: number, expense: number, count: number): Totals {
    return {
      income,
      expense,
      balance: income - expense,
      count,
    };
  }

  private totalsFromRow(
    row: { incomeCents: string; expenseCents: string; count: string },
    currency: Currency,
  ): Totals {
    const income = CurrencyConfig.fromMinorUnits(Number(row?.incomeCents ?? 0), currency);
    const expense = CurrencyConfig.fromMinorUnits(Number(row?.expenseCents ?? 0), currency);
    const count = Number(row?.count ?? 0);
    return this.makeTotals(income, expense, count);
  }

  private buildBaseExpenseQuery(
    userId: string,
    currency: Currency,
    from: Date,
    to: Date,
    type?: ExpenseType,
  ): SelectQueryBuilder<Expense> {
    const qb = this.expenseRepository
      .createQueryBuilder('e')
      .where('e.user_id = :userId', { userId })
      .andWhere('e.currency = :currency', { currency })
      .andWhere('e.spent_at >= :from', { from })
      .andWhere('e.spent_at <= :to', { to });

    if (type) {
      qb.andWhere('e.type = :type', { type });
    }

    return qb;
  }
}
