import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryCreateDto } from './dto/create-category.dto';
import { CategoryPatchDto } from './dto/patch-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { CategoryResponseDto } from './dto/response-category.dto';
import { Category } from './entities/category.entity';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('categories')
@ApiTags('Categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  @Post()
  @ApiOkResponse({ type: CategoryResponseDto })
  public async create(
    @CurrentUserId() userId: string,
    @Body() categoryCreateDto: CategoryCreateDto,
  ): Promise<CategoryResponseDto> {
    const category: Category = await this.categoryService.create(userId, categoryCreateDto);
    return new CategoryResponseDto(category);
  }

  @Get()
  @ApiOkResponse({ type: Array<CategoryResponseDto> })
  public async findAll(@CurrentUserId() userId: string): Promise<Array<CategoryResponseDto>> {
    const categories: Array<Category> = await this.categoryService.findAll(userId);
    return categories.map(category => new CategoryResponseDto(category));
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoryResponseDto })
  public async findOne(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<CategoryResponseDto> {
    const category: Category = await this.categoryService.findOne(userId, id);
    return new CategoryResponseDto(category);
  }

  @Patch(':id')
  @ApiOkResponse({ type: CategoryResponseDto })
  public async update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() categoryPatchDto: CategoryPatchDto,
  ): Promise<CategoryResponseDto> {
    const category: Category = await this.categoryService.update(userId, id, categoryPatchDto);
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
