import { CurrencyConfig } from "src/common/money/money.util";
import { Expense } from "../entities/expense.entity";
import { CategoryResponseDto } from "src/category/dto/response-category.dto";
import { Currency } from "../enums/currency.enum";
import { ExpenseType } from "../enums/expense-type.enum";
import { ApiProperty } from "@nestjs/swagger";

export class ExpenseResponseDto {
  @ApiProperty({ description: 'The unique identifier of the expense' })
  public readonly id: string;
  @ApiProperty({ description: 'The unique identifier of the user who created the expense' })
  public readonly userId: string;
  @ApiProperty({ description: 'The category of the expense', type: () => CategoryResponseDto, nullable: true })
  public readonly category?: CategoryResponseDto | null;
  @ApiProperty({ description: 'The name of the expense' })
  public readonly name: string;
  @ApiProperty({ description: 'A brief description of the expense', nullable: true })
  public readonly description?: string | null;
  @ApiProperty({ description: 'The amount of the expense' })
  public readonly amount: number;
  @ApiProperty({ description: 'The currency of the expense', type: String, enum: Currency })
  public readonly currency: Currency;
  @ApiProperty({ description: 'The type of the expense', type: String, enum: ExpenseType })
  public readonly type: ExpenseType;
  @ApiProperty({ description: 'The date and time when the expense was spent' })
  public readonly spentAt: Date;
  @ApiProperty({ description: 'The date and time when the expense was created' })
  public readonly createdAt: Date;
  @ApiProperty({ description: 'The date and time when the expense was last updated' })
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