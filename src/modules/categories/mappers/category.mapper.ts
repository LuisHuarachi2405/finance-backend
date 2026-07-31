import { Category } from '../../../generated/prisma/client.js';
import { CategoryEntity } from '../entities/category.entity';

export function toCategoryEntity(category: Category): CategoryEntity {
  return {
    id: category.id,
    userId: category.userId,
    name: category.name,
    type: category.type,
    description: category.description,
    color: category.color,
    icon: category.icon,
    active: category.active,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}
