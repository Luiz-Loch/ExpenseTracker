import { IsEnum, IsISO8601, IsNotEmpty, IsOptional } from "class-validator";
import { ExpenseType } from "../../expense/enums/expense-type.enum";
import { Currency } from "../../expense/enums/currency.enum";

export class SummaryQueryDto {
  @IsOptional()
  @IsEnum(ExpenseType)
  type?: ExpenseType;

  @IsOptional()
  @IsEnum(Currency)
  public readonly currency?: Currency;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  public readonly from: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  public readonly to: string;
}
