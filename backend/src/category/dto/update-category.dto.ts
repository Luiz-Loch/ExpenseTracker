import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { CategoryType } from '../enums/category-type.enum';

export class CategoryUpdateDto {

  @IsString()
  @Length(2, 100)
  @IsOptional()
  public readonly name?: string;

  @IsEnum(CategoryType)
  @IsOptional()
  public readonly type?: CategoryType;
}
