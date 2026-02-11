import { IsEnum, IsISO8601, IsNotEmpty, IsOptional } from "class-validator";
import { ExpenseType } from "../../expense/enums/expense-type.enum";
import { Currency } from "../../expense/enums/currency.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SummaryQueryDto {
  @IsOptional()
  @IsEnum(ExpenseType)
  @ApiPropertyOptional({ description: 'The type of the expense', type: String, enum: ExpenseType, required: false })
  type?: ExpenseType;

  @IsOptional()
  @IsEnum(Currency)
  @ApiPropertyOptional({ description: 'The currency of the expense', type: String, enum: Currency, required: false })
  public readonly currency?: Currency;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  @ApiProperty({ description: 'The start date for the report', type: String, format: 'date-time' })
  public readonly from: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  @ApiProperty({ description: 'The end date for the report', type: String, format: 'date-time' })
  public readonly to: string;
}
