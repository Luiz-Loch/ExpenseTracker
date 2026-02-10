import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "../../../category/entities/category.entity";
import { ExpenseUpdateValidator } from "./expense-update.validator";
import { ExpensePatchDto } from "../../dto/patch-expense.dto";

export class CategoryExistsOnUpdateValidator
  implements ExpenseUpdateValidator {

  public constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  public async validate(userId: string, id: string, expensePatchDto: ExpensePatchDto): Promise<void> {
    if (!expensePatchDto.categoryId) {
      return;
    }

    const existing = await this.categoryRepository.existsBy({
      id: expensePatchDto.categoryId,
      user: { id: userId },
    });

    if (!existing) {
      throw new NotFoundException(`Category with id ${expensePatchDto.categoryId} not found`);
    }
  }
}
