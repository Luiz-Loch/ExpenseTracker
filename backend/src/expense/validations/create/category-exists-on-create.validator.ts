import { Injectable, NotFoundException } from "@nestjs/common";
import { ExpenseCreateValidator } from "./expense-create.validator";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "../../../category/entities/category.entity";
import { Repository } from "typeorm";
import { ExpenseCreateDto } from "../../dto/create-expense.dto";

@Injectable()
export class CategoryExistsOnCreateValidator
  implements ExpenseCreateValidator {

  public constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  public async validate(userId: string, expenseCreateDto: ExpenseCreateDto): Promise<void> {
    if (!expenseCreateDto.categoryId) {
      return;
    }

    const existing = await this.categoryRepository.existsBy({
      id: expenseCreateDto.categoryId,
      user: { id: userId },
    });

    if (!existing) {
      throw new NotFoundException(`Category with id ${expenseCreateDto.categoryId} not found`);
    }
  }
}
