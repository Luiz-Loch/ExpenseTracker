import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Expense } from './entities/expense.entity';
import { Category } from '../category/entities/category.entity';
import { CategoryExistsOnUpdateValidator } from './validations/update/category-exists-on-update.validator';
import { CategoryExistsOnCreateValidator } from './validations/create/category-exists-on-create.validator';
import { EXPENSE_CREATE_VALIDATORS, EXPENSE_UPDATE_VALIDATORS } from './validations/tokens';

@Module({
  controllers: [ExpenseController],
  providers: [
    ExpenseService,
    CategoryExistsOnCreateValidator,
    CategoryExistsOnUpdateValidator,
    {
      provide: EXPENSE_CREATE_VALIDATORS,
      useFactory: (categoryExistsOnCreateValidator: CategoryExistsOnCreateValidator) => [categoryExistsOnCreateValidator],
      inject: [CategoryExistsOnCreateValidator]
    },
    {
      provide: EXPENSE_UPDATE_VALIDATORS,
      useFactory: (categoryExistsOnUpdateValidator: CategoryExistsOnUpdateValidator) => [categoryExistsOnUpdateValidator],
      inject: [CategoryExistsOnUpdateValidator]
    },
  ],
  imports: [TypeOrmModule.forFeature([User, Expense, Category])],
})
export class ExpenseModule { }
