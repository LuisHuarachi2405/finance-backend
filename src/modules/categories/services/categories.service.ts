import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category, CategoryType } from '../../../generated/prisma/client.js';
import { CATEGORY_REPOSITORY } from '../constants/categories.constants';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { ListCategoriesQueryDto } from '../dto/list-categories-query.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import type { CategoryRepository } from '../interfaces/category-repository.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createCategory(
    userId: string,
    dto: CreateCategoryDto,
  ): Promise<Category> {
    await this.ensureNameIsAvailable(userId, dto.name, dto.type);
    return this.categoryRepository.create({ userId, ...dto });
  }

  async getCategory(userId: string, id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category || category.userId !== userId) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  listCategories(
    userId: string,
    query: ListCategoriesQueryDto,
  ): Promise<Category[]> {
    return this.categoryRepository.findAllByUser(userId, {
      type: query.type,
      active: query.active ?? true,
    });
  }

  async updateCategory(
    userId: string,
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.getCategory(userId, id);

    if (dto.name || dto.type) {
      await this.ensureNameIsAvailable(
        userId,
        dto.name ?? category.name,
        dto.type ?? category.type,
        category.id,
      );
    }

    return this.categoryRepository.update(id, dto);
  }

  async archiveCategory(userId: string, id: string): Promise<Category> {
    await this.getCategory(userId, id);
    return this.categoryRepository.updateActive(id, false);
  }

  async restoreCategory(userId: string, id: string): Promise<Category> {
    await this.getCategory(userId, id);
    return this.categoryRepository.updateActive(id, true);
  }

  private async ensureNameIsAvailable(
    userId: string,
    name: string,
    type: CategoryType,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.categoryRepository.findByNameAndType(
      userId,
      name,
      type,
    );

    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        'A category with this name and type already exists',
      );
    }
  }
}
