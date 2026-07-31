import { Budget, BudgetPeriod } from '../../../generated/prisma/client.js';

export interface CreateBudgetInput {
  userId: string;
  categoryId: string;
  name: string;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
}

export interface UpdateBudgetInput {
  name?: string;
  amount?: number;
  period?: BudgetPeriod;
  startDate?: Date;
  endDate?: Date;
}

export interface ListBudgetsFilter {
  categoryId?: string;
  period?: BudgetPeriod;
  active: boolean;
}

export interface BudgetRepository {
  create(data: CreateBudgetInput): Promise<Budget>;
  findById(id: string): Promise<Budget | null>;
  findAllByUser(userId: string, filter: ListBudgetsFilter): Promise<Budget[]>;
  update(id: string, data: UpdateBudgetInput): Promise<Budget>;
  updateActive(id: string, active: boolean): Promise<Budget>;
}
