import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  FinancialGoal,
  FinancialGoalStatus,
} from '../../../generated/prisma/client.js';
import {
  CreateFinancialGoalInput,
  FinancialGoalRepository,
  ListFinancialGoalsFilter,
  UpdateFinancialGoalInput,
} from '../interfaces/financial-goal-repository.interface';

@Injectable()
export class PrismaFinancialGoalRepository implements FinancialGoalRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateFinancialGoalInput): Promise<FinancialGoal> {
    return this.prisma.financialGoal.create({ data });
  }

  findById(id: string): Promise<FinancialGoal | null> {
    return this.prisma.financialGoal.findUnique({ where: { id } });
  }

  findAllByUser(
    userId: string,
    filter: ListFinancialGoalsFilter,
  ): Promise<FinancialGoal[]> {
    return this.prisma.financialGoal.findMany({
      where: { userId, status: filter.status },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: string, data: UpdateFinancialGoalInput): Promise<FinancialGoal> {
    return this.prisma.financialGoal.update({ where: { id }, data });
  }

  updateSavedAmount(
    id: string,
    currentSavedAmount: number,
  ): Promise<FinancialGoal> {
    return this.prisma.financialGoal.update({
      where: { id },
      data: { currentSavedAmount },
    });
  }

  updateStatus(
    id: string,
    status: FinancialGoalStatus,
  ): Promise<FinancialGoal> {
    return this.prisma.financialGoal.update({
      where: { id },
      data: { status },
    });
  }
}
