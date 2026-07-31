import { CategoryType } from '../../../generated/prisma/client.js';

export class CategoryEntity {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  description: string | null;
  color: string | null;
  icon: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
