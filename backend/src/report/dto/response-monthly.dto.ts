import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "../../expense/enums/currency.enum";
import { MonthlyItem, MonthlyReport } from "../types/monthly.type";
import { TotalsResponseDto } from "./response-totals.dto";

export class MonthlyResponseDto {
  @ApiProperty({ description: 'Year of the report' })
  public readonly year: number;
  @ApiProperty({ description: 'Currency of the report' })
  public readonly currency: Currency;
  @ApiProperty({ description: 'Monthly items of the report' })
  public readonly months: Array<MonthlyItemResponseDto>;

  public constructor(monthlyReport: MonthlyReport) {
    this.year = monthlyReport.year;
    this.currency = monthlyReport.currency;
    this.months = monthlyReport.months.map(monthlyItem => new MonthlyItemResponseDto(monthlyItem));
  }
}

export class MonthlyItemResponseDto {
  @ApiProperty({ description: 'Month of the report' })
  public readonly month: number; // 1..12
  @ApiProperty({ description: 'Totals of the report' })
  public readonly totals: TotalsResponseDto;

  public constructor(monthlyItem: MonthlyItem) {
    this.month = monthlyItem.month;
    this.totals = new TotalsResponseDto(monthlyItem.totals);
  }
}