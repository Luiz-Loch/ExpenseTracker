import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Length, MaxLength, Min } from "class-validator";
import { Currency } from "../enums/currency.enum";
import { Type } from "class-transformer";
import { ExpenseType } from "../enums/expense-type.enum";

export class ExpenseCreateDto {
  @IsString()
  @Length(2, 100)
  public readonly name: string;

  @IsUUID()
  @IsOptional()
  public readonly categoryId?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  public readonly description?: string;

  @Min(0.01)
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  public readonly amount: number;

  @IsEnum(Currency)
  @IsOptional()
  public readonly currency?: Currency;

  @IsEnum(ExpenseType)
  public readonly type?: ExpenseType;

  @Type(() => Date)
  @IsDate()
  public readonly spentAt: Date;
}
