import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RecurringExpense } from '../../../generated/prisma/client.js';
import {
  CreateRecurringExpenseInput,
  ListRecurringExpensesFilter,
  RecurringExpenseRepository,
  UpdateRecurringExpenseInput,
} from '../interfaces/recurring-expense-repository.interface';

@Injectable()
export class PrismaRecurringExpenseRepository implements RecurringExpenseRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateRecurringExpenseInput): Promise<RecurringExpense> {
    return this.prisma.recurringExpense.create({ data });
  }

  findById(id: string): Promise<RecurringExpense | null> {
    return this.prisma.recurringExpense.findUnique({ where: { id } });
  }

  findAllByUser(
    userId: string,
    filter: ListRecurringExpensesFilter,
  ): Promise<RecurringExpense[]> {
    return this.prisma.recurringExpense.findMany({
      where: {
        userId,
        categoryId: filter.categoryId,
        accountId: filter.accountId,
        frequency: filter.frequency,
        active: filter.active,
      },
      orderBy: { name: 'asc' },
    });
  }

  update(
    id: string,
    data: UpdateRecurringExpenseInput,
  ): Promise<RecurringExpense> {
    return this.prisma.recurringExpense.update({ where: { id }, data });
  }

  updateActive(id: string, active: boolean): Promise<RecurringExpense> {
    return this.prisma.recurringExpense.update({
      where: { id },
      data: { active },
    });
  }
}
