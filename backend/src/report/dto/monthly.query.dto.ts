import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { Currency } from "../../expense/enums/currency.enum";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class MonthlyQueryDto {
  @IsInt()
  @Type(() => Number)
  @Min(1970)
  @Max(2100)
  @ApiProperty({ description: 'The year for the report', type: Number, required: true })
  public readonly year: number;

  @IsOptional()
  @IsEnum(Currency)
  @ApiPropertyOptional({ description: 'The currency of the report', type: String, enum: Currency, required: false })
  public readonly currency?: Currency;
}