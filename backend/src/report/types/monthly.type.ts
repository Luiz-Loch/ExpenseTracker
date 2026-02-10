import { Currency } from "src/expense/enums/currency.enum";
import { Totals } from "./totals.type";

export type MonthlyReport = {
  year: number;
  currency: Currency;
  months: Array<MonthlyItem>;
};

export type MonthlyItem = {
  month: number; // 1..12
  totals: Totals;
};