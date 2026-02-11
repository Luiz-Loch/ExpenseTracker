import { ApiProperty } from "@nestjs/swagger";
import { Totals } from "../types/totals.type";

export class TotalsResponseDto {
  @ApiProperty({ description: 'Total income', example: 5000 })
  public readonly income: number;
  @ApiProperty({ description: 'Total expense', example: 3000 })
  public readonly expense: number;
  @ApiProperty({ description: 'Balance (income - expense)', example: 2000 })
  public readonly balance: number;
  @ApiProperty({ description: 'Count of transactions', example: 50 })
  public readonly count: number;

  public constructor(totals: Totals) {
    this.income = totals.income;
    this.expense = totals.expense;
    this.balance = totals.balance;
    this.count = totals.count;
  }
}