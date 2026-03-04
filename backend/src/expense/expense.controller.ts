import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Inject } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExpenseCreateDto } from './dto/create-expense.dto';
import { ExpenseResponseDto } from './dto/response-expense.dto';
import { Expense } from './entities/expense.entity';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { ExpensePatchDto } from './dto/patch-expense.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller('expenses')
@ApiTags('Expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class ExpenseController {

  private static readonly CACHE_KEY_PREFIX: string = 'expense:';

  public constructor(
    private readonly expenseService: ExpenseService,

    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) { }

  private expenseCacheKey(userId: string, expenseId: string): string {
    return `${ExpenseController.CACHE_KEY_PREFIX}${userId}:${expenseId}`;
  }

  @Post()
  @ApiOkResponse({ type: ExpenseResponseDto })
  public async create(
    @CurrentUserId() userId: string,
    @Body() expenseCreateDto: ExpenseCreateDto,
  ): Promise<ExpenseResponseDto> {
    const expense: Expense = await this.expenseService.create(userId, expenseCreateDto);
    return new ExpenseResponseDto(expense);
  }

  @Get()
  @ApiOkResponse({ type: PaginatedResponseDto<ExpenseResponseDto> })
  public async findAll(
    @CurrentUserId() userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ExpenseResponseDto>> {
    const [expenses, total]: [Array<Expense>, number] = await this.expenseService.findAll(userId, paginationQuery);
    const data: Array<ExpenseResponseDto> = expenses.map(expense => new ExpenseResponseDto(expense));
    return new PaginatedResponseDto(data, total, paginationQuery.page, paginationQuery.limit);
  }

  @Get(':id')
  @ApiOkResponse({ type: ExpenseResponseDto })
  public async findOne(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<ExpenseResponseDto> {
    const cacheKey: string = this.expenseCacheKey(userId, id);
    const cached: ExpenseResponseDto | undefined = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const expense: Expense = await this.expenseService.findOne(userId, id);
    const response: ExpenseResponseDto = new ExpenseResponseDto(expense);
    await this.cache.set(cacheKey, response);
    return response;
  }

  @Patch(':id')
  @ApiOkResponse({ type: ExpenseResponseDto })
  public async update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() expensePatchDto: ExpensePatchDto,
  ): Promise<ExpenseResponseDto> {
    await this.cache.del(this.expenseCacheKey(userId, id));
    const expense: Expense = await this.expenseService.update(userId, id, expensePatchDto);
    return new ExpenseResponseDto(expense);
  }

  @Delete(':id')
  public async remove(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.cache.del(this.expenseCacheKey(userId, id));
    return await this.expenseService.remove(userId, id);
  }
}
