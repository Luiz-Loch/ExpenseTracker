import { CurrencyConfig } from "src/common/money/money.util";
import { Expense } from "../entities/expense.entity";
import { CategoryResponseDto } from "src/category/dto/response-category.dto";
import { Currency } from "../enums/currency.enum";
import { ExpenseType } from "../enums/expense-type.enum";

export class ExpenseResponseDto {
  public readonly id: string;
  public readonly userId: string;
  public readonly category?: CategoryResponseDto | null;
  public readonly name: string;
  public readonly description?: string | null;
  public readonly amount: number;
  public readonly currency: Currency;
  public readonly type: ExpenseType;
  public readonly spentAt: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(expense: Expense) {
    this.id = expense.id;
    this.userId = expense.user.id;
    this.category = expense.category ? new CategoryResponseDto(expense.category) : null;
    this.name = expense.name;
    this.description = expense.description;
    this.amount = CurrencyConfig.fromMinorUnits(expense.amountCents, expense.currency);
    this.currency = expense.currency;
    this.type = expense.type;
    this.spentAt = expense.spentAt;
    this.createdAt = expense.createdAt;
    this.updatedAt = expense.updatedAt;
  }
}