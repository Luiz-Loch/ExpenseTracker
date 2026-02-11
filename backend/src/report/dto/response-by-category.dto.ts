import { Currency } from "../../expense/enums/currency.enum";
import { TotalsResponseDto } from "./response-totals.dto";
import { ByCategoryReport, CategoryItem } from "../types/by-category.type";
import { CategoryResponseDto } from "../../category/dto/response-category.dto";
import { ApiProperty } from "@nestjs/swagger";

export class ByCategoryResponseDto {
  @ApiProperty({ description: 'Date range of the report' })
  public readonly range: {
    from: Date;
    to: Date;
  }
  @ApiProperty({ description: 'Currency of the report', type: String, enum: Currency, example: Currency.BRL })
  public readonly currency: Currency;
  @ApiProperty({ description: 'Report data grouped by category'})
  public readonly byCategory: Array<CategoryItemResponseDto>;

  public constructor(byCategory: ByCategoryReport) {
    this.range = byCategory.range;
    this.currency = byCategory.currency;
    this.byCategory = byCategory.items.map(item => new CategoryItemResponseDto(item));
  }
}

export class CategoryItemResponseDto {
  @ApiProperty({ description: 'Category data', type: CategoryResponseDto, nullable: true })
  public readonly category: CategoryResponseDto | null;
  @ApiProperty({ description: 'Total amounts for the category' })
  public readonly totals: TotalsResponseDto;

  public constructor(categoryItem: CategoryItem) {
    this.category = categoryItem.category;
    this.totals = new TotalsResponseDto(categoryItem.totals);
  }

}