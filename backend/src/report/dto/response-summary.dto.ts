import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "../../expense/enums/currency.enum";
import { SummaryReport } from "../types/summary.types";
import { CategoryItemResponseDto } from "./response-by-category.dto";
import { TotalsResponseDto } from "./response-totals.dto";

export class SummaryResponseDto {
	@ApiProperty({ description: 'Date range of the report' })
	public readonly range: {
		from: Date;
		to: Date;
	}
	@ApiProperty({ description: 'Currency of the report', type: String, enum: Currency, example: Currency.BRL })
	public readonly currency: Currency;
	@ApiProperty({ description: 'Total amounts for the report' })
	public readonly totals: TotalsResponseDto;
	@ApiProperty({ description: 'Report data grouped by category', type: Array<CategoryItemResponseDto> })
	public readonly byCategory: Array<CategoryItemResponseDto>;

	public constructor(summaryReport: SummaryReport) {
		this.range = summaryReport.range;
		this.currency = summaryReport.currency;
		this.totals = new TotalsResponseDto(summaryReport.totals);
		this.byCategory = summaryReport.byCategory.map(categoryItem => new CategoryItemResponseDto(categoryItem));
	}
}