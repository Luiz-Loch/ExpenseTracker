import { ExpensePatchDto } from "../../dto/patch-expense.dto";

export interface ExpenseUpdateValidator {

  validate(userId: string, id: string, expensePatchDto: ExpensePatchDto): Promise<void> | void;

}
