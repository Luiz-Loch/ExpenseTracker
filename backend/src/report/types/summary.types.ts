import { Currency } from "src/expense/enums/currency.enum";
import { Totals } from "./totals.type";
import { CategoryItem } from "./by-category.type";

export type SummaryReport = {
  range: {
    from: Date;
    to: Date;
  };
  currency: Currency;
  totals: Totals;
  byCategory: Array<CategoryItem>;
};
