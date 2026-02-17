import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class CategoryPatchDto {

  @IsString()
  @Length(2, 100)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Name to update the category to' })
  public readonly name?: string;

  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/, { message: 'color must be a valid hex color (e.g. #ff5733)' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'Hex color for the category (e.g. #ff5733)', example: '#ff5733' })
  public readonly color?: string;
}
