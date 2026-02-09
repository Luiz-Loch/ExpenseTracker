import { CategoryCreateValidator } from './category-create.validator';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryCreateDto } from '../../dto/create-category.dto';

@Injectable()
export class NameUniqueValidator
  implements CategoryCreateValidator {

  public constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  public async validate(userId: string, categoryCreateDto: CategoryCreateDto): Promise<void> {
    const name: string = categoryCreateDto.name.trim();

    const existing = await this.categoryRepository.existsBy({
      name,
      user: { id: userId },
    });

    if (existing) {
      throw new ConflictException('Name already in use');
    }
  }
}
