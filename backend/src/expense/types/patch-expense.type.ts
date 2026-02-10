import { Category } from "../../category/entities/category.entity";
import { Currency } from "../enums/currency.enum";
import { ExpenseType } from "../enums/expense-type.enum";

export type ExpensePatch = {
  name?: string;
  description?: string | null;
  amount?: number;
  currency?: Currency;
  type?: ExpenseType;
  spentAt?: Date;
  category?: Category | null;
};
