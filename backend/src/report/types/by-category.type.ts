import { Currency } from "../../expense/enums/currency.enum";
import { CategoryResponseDto } from "../../category/dto/response-category.dto";
import { Totals } from "./totals.type";

export type ByCategoryReport = {
  range: {
    from: Date;
    to: Date;
  };
  currency: Currency;
  items: Array<CategoryItem>;
};

export type CategoryItem = {
  category: CategoryResponseDto | null;
  totals: Totals;
};