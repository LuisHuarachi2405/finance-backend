import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { ListCategoriesQueryDto } from '../dto/list-categories-query.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryEntity } from '../entities/category.entity';
import { toCategoryEntity } from '../mappers/category.mapper';
import { CategoriesService } from '../services/categories.service';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a category' })
  async createCategory(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.categoriesService.createCategory(user.id, dto);
    return toCategoryEntity(category);
  }

  @Get()
  @ApiOperation({ summary: 'List categories owned by the authenticated user' })
  async listCategories(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListCategoriesQueryDto,
  ): Promise<CategoryEntity[]> {
    const categories = await this.categoriesService.listCategories(
      user.id,
      query,
    );
    return categories.map(toCategoryEntity);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  async getCategory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<CategoryEntity> {
    const category = await this.categoriesService.getCategory(user.id, id);
    return toCategoryEntity(category);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  async updateCategory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.categoriesService.updateCategory(
      user.id,
      id,
      dto,
    );
    return toCategoryEntity(category);
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a category' })
  async archiveCategory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<CategoryEntity> {
    const category = await this.categoriesService.archiveCategory(user.id, id);
    return toCategoryEntity(category);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived category' })
  async restoreCategory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<CategoryEntity> {
    const category = await this.categoriesService.restoreCategory(user.id, id);
    return toCategoryEntity(category);
  }
}
