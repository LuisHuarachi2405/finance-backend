import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Budget } from '../../../generated/prisma/client.js';
import {
  BudgetRepository,
  CreateBudgetInput,
  ListBudgetsFilter,
  UpdateBudgetInput,
} from '../interfaces/budget-repository.interface';

@Injectable()
export class PrismaBudgetRepository implements BudgetRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateBudgetInput): Promise<Budget> {
    return this.prisma.budget.create({ data });
  }

  findById(id: string): Promise<Budget | null> {
    return this.prisma.budget.findUnique({ where: { id } });
  }

  findAllByUser(userId: string, filter: ListBudgetsFilter): Promise<Budget[]> {
    return this.prisma.budget.findMany({
      where: {
        userId,
        categoryId: filter.categoryId,
        period: filter.period,
        active: filter.active,
      },
    });
  }

  update(id: string, data: UpdateBudgetInput): Promise<Budget> {
    return this.prisma.budget.update({ where: { id }, data });
  }

  updateActive(id: string, active: boolean): Promise<Budget> {
    return this.prisma.budget.update({ where: { id }, data: { active } });
  }
}
