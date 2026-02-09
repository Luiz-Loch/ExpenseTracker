import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryCreateDto } from './dto/create-category.dto';
import { CategoryUpdateDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { CategoryResponseDto } from './dto/response-category.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  @Post()
  public async create(
    @CurrentUserId() userId: string,
    @Body() categoryCreateDto: CategoryCreateDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.create(userId, categoryCreateDto);
    return new CategoryResponseDto(category);
  }

  @Get()
  public async findAll(@CurrentUserId() userId: string): Promise<Array<CategoryResponseDto>> {
    const categories = await this.categoryService.findAll(userId);
    return categories.map(category => new CategoryResponseDto(category));
  }

  @Get(':id')
  public async findOne(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.findOne(userId, id);
    return new CategoryResponseDto(category);
  }

  @Patch(':id')
  public async update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() categoryUpdateDto: CategoryUpdateDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.update(userId, id, categoryUpdateDto);
    return new CategoryResponseDto(category);
  }

  @Delete(':id')
  public async remove(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return await this.categoryService.remove(userId, id);
  }
}
