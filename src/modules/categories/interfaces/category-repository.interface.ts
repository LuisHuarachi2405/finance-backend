import { Category, CategoryType } from '../../../generated/prisma/client.js';

export interface CreateCategoryInput {
  userId: string;
  name: string;
  type: CategoryType;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  type?: CategoryType;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
}

export interface ListCategoriesFilter {
  type?: CategoryType;
  active?: boolean;
}

export interface CategoryRepository {
  create(data: CreateCategoryInput): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findByNameAndType(
    userId: string,
    name: string,
    type: CategoryType,
  ): Promise<Category | null>;
  findAllByUser(
    userId: string,
    filter: ListCategoriesFilter,
  ): Promise<Category[]>;
  update(id: string, data: UpdateCategoryInput): Promise<Category>;
  updateActive(id: string, active: boolean): Promise<Category>;
}
