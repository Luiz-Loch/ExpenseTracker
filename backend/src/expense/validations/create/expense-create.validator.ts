import { ExpenseCreateDto } from "../../dto/create-expense.dto";


export interface ExpenseCreateValidator {

  validate(userId: string, expenseCreateDto: ExpenseCreateDto): Promise<void> | void;

}
