import { ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryUpdateValidator } from "./category-update.validator";
import { Category } from "../../entities/category.entity";
import { CategoryPatchDto } from "../../dto/patch-category.dto";

export class NameUniqueOnUpdateValidator
  implements CategoryUpdateValidator {

  public constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  public async validate(userId: string, id: string, categoryPatchDto: CategoryPatchDto): Promise<void> {
    if (!categoryPatchDto.name) {
      return;
    }

    const name: string = categoryPatchDto.name.trim();

    const existing: Category | null = await this.categoryRepository.findOne({
      where: {
        name,
        user: { id: userId }
      },
    });

    if (existing && existing.id !== id) {
      throw new ConflictException('Name already in use');
    }

  }

}
