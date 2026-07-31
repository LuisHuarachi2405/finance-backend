import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Category, CategoryType } from '../../../generated/prisma/client.js';
import {
  CategoryRepository,
  CreateCategoryInput,
  ListCategoriesFilter,
  UpdateCategoryInput,
} from '../interfaces/category-repository.interface';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCategoryInput): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  findByNameAndType(
    userId: string,
    name: string,
    type: CategoryType,
  ): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { userId_name_type: { userId, name, type } },
    });
  }

  findAllByUser(
    userId: string,
    filter: ListCategoriesFilter,
  ): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { userId, type: filter.type, active: filter.active },
    });
  }

  update(id: string, data: UpdateCategoryInput): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data });
  }

  updateActive(id: string, active: boolean): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data: { active } });
  }
}
