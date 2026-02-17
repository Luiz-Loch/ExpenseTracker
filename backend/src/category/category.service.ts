import { Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { User } from '../user/entities/user.entity';
import { CATEGORY_CREATE_VALIDATORS, CATEGORY_UPDATE_VALIDATORS } from './validations/tokens';
import { CategoryCreateValidator } from './validations/create/category-create.validator';
import { CategoryUpdateValidator } from './validations/update/category-update.validator';
import { CategoryCreateDto } from './dto/create-category.dto';
import { CategoryPatchDto } from './dto/patch-category.dto';


@Injectable()
export class CategoryService {

  public constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(CATEGORY_CREATE_VALIDATORS)
    private readonly createValidators: Array<CategoryCreateValidator>,

    @Inject(CATEGORY_UPDATE_VALIDATORS)
    private readonly updateValidators: Array<CategoryUpdateValidator>,
  ) { }

  public async create(userId: string, categoryCreateDto: CategoryCreateDto): Promise<Category> {
    for (const validator of this.createValidators) {
      await validator.validate(userId, categoryCreateDto);
    }

    const user: User = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    const category: Category = this.categoryRepository.create({
      user: user,
      name: categoryCreateDto.name.trim(),
      color: categoryCreateDto.color,
    });

    return this.categoryRepository.save(category);
  }

  public async findAll(userId: string): Promise<Array<Category>> {
    return this.categoryRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        user: true,
      },
      order: { name: 'ASC' },
    });
  }

  public async findOne(userId: string, id: string): Promise<Category> {
    const category: Category | null = await this.categoryRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: {
        user: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  public async update(userId: string, id: string, categoryPatchDto: CategoryPatchDto): Promise<Category> {
    const category: Category = await this.findOne(userId, id);

    for (const validator of this.updateValidators) {
      await validator.validate(userId, id, categoryPatchDto);
    }

    category.update(categoryPatchDto);

    return this.categoryRepository.save(category);
  }

  public async remove(userId: string, id: string): Promise<void> {
    const category: Category = await this.findOne(userId, id);

    await this.categoryRepository.softRemove(category);
  }
}
