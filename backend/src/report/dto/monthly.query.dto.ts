import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { Currency } from "../../expense/enums/currency.enum";
import { Type } from "class-transformer";

export class MonthlyQueryDto {
  @IsInt()
  @Type(() => Number)
  @Min(1970)
  @Max(2100)
  public readonly year: number;

  @IsOptional()
  @IsEnum(Currency)
  public readonly currency?: Currency;
}