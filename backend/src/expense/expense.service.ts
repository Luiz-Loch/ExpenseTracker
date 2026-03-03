import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseCreateDto } from './dto/create-expense.dto';
import { ExpensePatchDto } from './dto/patch-expense.dto';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { Currency } from './enums/currency.enum';
import { EXPENSE_CREATE_VALIDATORS, EXPENSE_UPDATE_VALIDATORS } from './validations/tokens';
import { ExpenseCreateValidator } from './validations/create/expense-create.validator';
import { ExpenseUpdateValidator } from './validations/update/expense-update.validator';
import { CurrencyConfig } from '../common/money/money.util';
import { ExpensePatch } from './types/patch-expense.type';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class ExpenseService {

  public constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @Inject(EXPENSE_CREATE_VALIDATORS)
    private readonly createValidators: Array<ExpenseCreateValidator>,

    @Inject(EXPENSE_UPDATE_VALIDATORS)
    private readonly updateValidators: Array<ExpenseUpdateValidator>,
  ) { }

  public async create(userId: string, expenseCreateDto: ExpenseCreateDto): Promise<Expense> {
    for (const validator of this.createValidators) {
      await validator.validate(userId, expenseCreateDto);
    }

    const user: User = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    const category: Category | null = await this.categoryRepository.findOne({
      where: {
        id: expenseCreateDto.categoryId,
        user: { id: userId },
      },
    });

    const expense: Expense = this.expenseRepository.create({
      user: user,
      category: category ?? undefined,
      name: expenseCreateDto.name.trim(),
      description: expenseCreateDto.description?.trim(),
      amountCents: CurrencyConfig.toMinorUnits(expenseCreateDto.amount, expenseCreateDto.currency ?? Currency.BRL),
      currency: expenseCreateDto.currency ?? Currency.BRL,
      type: expenseCreateDto.type,
      spentAt: expenseCreateDto.spentAt,
    });

    return this.expenseRepository.save(expense);
  }

  public async findAll(userId: string, paginationQuery: PaginationQueryDto): Promise<[Array<Expense>, number]> {
    return this.expenseRepository.findAndCount({
      where: {
        user: { id: userId },
      },
      relations: {
        category: true,
        user: true,
      },
      order: { spentAt: 'DESC' },
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });
  }

  public async findOne(userId: string, id: string): Promise<Expense> {
    const expense: Expense | null = await this.expenseRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: {
        category: true,
        user: true,
      },
    });

    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }

    return expense;
  }

  public async update(userId: string, id: string, expensePatchDto: ExpensePatchDto): Promise<Expense> {
    const expense: Expense = await this.findOne(userId, id);

    for (const validator of this.updateValidators) {
      await validator.validate(userId, id, expensePatchDto);
    }

    const patch: ExpensePatch = {
      ...(expensePatchDto.name !== undefined && { name: expensePatchDto.name }),
      ...(expensePatchDto.description !== undefined && { description: expensePatchDto.description }),
      ...(expensePatchDto.amount !== undefined && { amount: expensePatchDto.amount }),
      ...(expensePatchDto.currency !== undefined && { currency: expensePatchDto.currency }),
      ...(expensePatchDto.type !== undefined && { type: expensePatchDto.type }),
      ...(expensePatchDto.spentAt !== undefined && { spentAt: expensePatchDto.spentAt }),
    };

    // categoryId: undefined = don't touch | null = clear | string = set
    if (expensePatchDto.categoryId === null) {
      patch.category = null;
    } else if (expensePatchDto.categoryId !== undefined) {
      const category = await this.categoryRepository.findOneOrFail({
        where: { id: expensePatchDto.categoryId, user: { id: userId } },
        relations: { user: true },
      });

      patch.category = category;
    }

    expense.update(patch);

    return this.expenseRepository.save(expense);
  }

  public async remove(userId: string, id: string): Promise<void> {
    const expense: Expense = await this.findOne(userId, id);

    await this.expenseRepository.softRemove(expense);
  }
}
