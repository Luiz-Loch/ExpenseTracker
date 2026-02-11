import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Length, MaxLength, Min } from "class-validator";
import { Currency } from "../enums/currency.enum";
import { Type } from "class-transformer";
import { ExpenseType } from "../enums/expense-type.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ExpensePatchDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  @ApiPropertyOptional({ description: 'The name of the expense' })
  public readonly name?: string;

  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The unique identifier of the category', nullable: true })
  public readonly categoryId?: string | null;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @ApiPropertyOptional({ description: 'A brief description of the expense', nullable: true })
  public readonly description?: string | null;

  @Min(0.01)
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsOptional()
  @ApiPropertyOptional({ description: 'The amount of the expense' })
  public readonly amount?: number;

  @IsEnum(Currency)
  @IsOptional()
  @ApiPropertyOptional({ description: 'The currency of the expense', type: String, enum: Currency })
  public readonly currency?: Currency;

  @IsEnum(ExpenseType)
  @IsOptional()
  @ApiPropertyOptional({ description: 'The type of the expense', type: String, enum: ExpenseType })
  public readonly type?: ExpenseType;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiPropertyOptional({ description: 'The date and time when the expense was spent' })
  public readonly spentAt?: Date;
}
