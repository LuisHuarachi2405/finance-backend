import {
  FinancialGoal,
  FinancialGoalStatus,
} from '../../../generated/prisma/client.js';

export interface CreateFinancialGoalInput {
  userId: string;
  name: string;
  targetAmount: number;
  currency: string;
  currentSavedAmount: number;
  targetDate?: Date | null;
  priority?: number | null;
  notes?: string | null;
}

export interface UpdateFinancialGoalInput {
  name?: string;
  targetAmount?: number;
  targetDate?: Date | null;
  priority?: number | null;
  notes?: string | null;
}

export interface ListFinancialGoalsFilter {
  status: FinancialGoalStatus;
}

export interface FinancialGoalRepository {
  create(data: CreateFinancialGoalInput): Promise<FinancialGoal>;
  findById(id: string): Promise<FinancialGoal | null>;
  findAllByUser(
    userId: string,
    filter: ListFinancialGoalsFilter,
  ): Promise<FinancialGoal[]>;
  update(id: string, data: UpdateFinancialGoalInput): Promise<FinancialGoal>;
  updateSavedAmount(
    id: string,
    currentSavedAmount: number,
  ): Promise<FinancialGoal>;
  updateStatus(id: string, status: FinancialGoalStatus): Promise<FinancialGoal>;
}
