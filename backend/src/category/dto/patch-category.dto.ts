import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class CategoryPatchDto {

  @IsString()
  @Length(2, 100)
  @IsOptional()
  public readonly name?: string;
}
