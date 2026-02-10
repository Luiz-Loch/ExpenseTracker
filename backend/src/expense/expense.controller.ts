import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExpenseCreateDto } from './dto/create-expense.dto';
import { ExpenseResponseDto } from './dto/response-expense.dto';
import { Expense } from './entities/expense.entity';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { ExpensePatchDto } from './dto/patch-expense.dto';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpenseController {
  public constructor(
    private readonly expenseService: ExpenseService,
  ) { }

  @Post()
  public async create(
    @CurrentUserId() userId: string,
    @Body() expenseCreateDto: ExpenseCreateDto,
  ): Promise<ExpenseResponseDto> {
    const expense: Expense = await this.expenseService.create(userId, expenseCreateDto);
    return new ExpenseResponseDto(expense);
  }

  @Get()
  public async findAll(@CurrentUserId() userId: string,
  ): Promise<Array<ExpenseResponseDto>> {
    const expenses: Array<Expense> = await this.expenseService.findAll(userId);
    return expenses.map(expense => new ExpenseResponseDto(expense));
  }

  @Get(':id')
  public async findOne(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<ExpenseResponseDto> {
    const expense: Expense = await this.expenseService.findOne(userId, id);
    return new ExpenseResponseDto(expense);
  }

  @Patch(':id')
  public async update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() expensePatchDto: ExpensePatchDto,
  ): Promise<ExpenseResponseDto> {
    const expense: Expense = await this.expenseService.update(userId, id, expensePatchDto);
    return new ExpenseResponseDto(expense);
  }

  @Delete(':id')
  public async remove(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return await this.expenseService.remove(userId, id);
  }
}
