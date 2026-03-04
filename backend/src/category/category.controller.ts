import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Inject } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryCreateDto } from './dto/create-category.dto';
import { CategoryPatchDto } from './dto/patch-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { CategoryResponseDto } from './dto/response-category.dto';
import { Category } from './entities/category.entity';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Controller('categories')
@ApiTags('Categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class CategoryController {

  private static readonly CACHE_KEY_PREFIX: string = 'category:';

  constructor(
    private readonly categoryService: CategoryService,

    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) { }

  private categoryCacheKey(userId: string, categoryId: string): string {
    return `${CategoryController.CACHE_KEY_PREFIX}${userId}:${categoryId}`;
  }

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
  @ApiOkResponse({ type: PaginatedResponseDto<CategoryResponseDto> })
  public async findAll(
    @CurrentUserId() userId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<CategoryResponseDto>> {
    const [categories, total]: [Array<Category>, number] = await this.categoryService.findAll(userId, paginationQuery);
    const data: Array<CategoryResponseDto> = categories.map(category => new CategoryResponseDto(category));
    return new PaginatedResponseDto(data, total, paginationQuery.page, paginationQuery.limit);
  }

  @Get(':id')
  @ApiOkResponse({ type: CategoryResponseDto })
  public async findOne(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<CategoryResponseDto> {
    const cacheKey: string = this.categoryCacheKey(userId, id);
    const cached: CategoryResponseDto | undefined = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const category: Category = await this.categoryService.findOne(userId, id);
    const response: CategoryResponseDto = new CategoryResponseDto(category);
    await this.cache.set(cacheKey, response);
    return response;
  }

  @Patch(':id')
  @ApiOkResponse({ type: CategoryResponseDto })
  public async update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() categoryPatchDto: CategoryPatchDto,
  ): Promise<CategoryResponseDto> {
    await this.cache.del(this.categoryCacheKey(userId, id));
    const category: Category = await this.categoryService.update(userId, id, categoryPatchDto);
    return new CategoryResponseDto(category);
  }

  @Delete(':id')
  public async remove(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.cache.del(this.categoryCacheKey(userId, id));
    return await this.categoryService.remove(userId, id);
  }
}
