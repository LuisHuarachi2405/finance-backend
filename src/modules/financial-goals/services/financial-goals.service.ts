import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SpendingPlanResult } from '../../spending-plan/entities/spending-plan.entity';
import { SpendingPlanService } from '../../spending-plan/services/spending-plan.service';
import {
  FinancialGoal,
  FinancialGoalStatus,
} from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';
import { FINANCIAL_GOAL_REPOSITORY } from '../constants/financial-goals.constants';
import { CreateFinancialGoalDto } from '../dto/create-financial-goal.dto';
import { ListFinancialGoalsQueryDto } from '../dto/list-financial-goals-query.dto';
import { UpdateFinancialGoalDto } from '../dto/update-financial-goal.dto';
import { UpdateSavedAmountDto } from '../dto/update-saved-amount.dto';
import {
  calculateFeasibility,
  FinancialGoalEntity,
  getMonthBoundaries,
  getNextMonthBoundaries,
  GoalFeasibilityResult,
} from '../entities/financial-goal.entity';
import type { FinancialGoalRepository } from '../interfaces/financial-goal-repository.interface';
import { toFinancialGoalEntity } from '../mappers/financial-goal.mapper';

@Injectable()
export class FinancialGoalsService {
  constructor(
    @Inject(FINANCIAL_GOAL_REPOSITORY)
    private readonly financialGoalRepository: FinancialGoalRepository,
    private readonly spendingPlanService: SpendingPlanService,
  ) {}

  async createFinancialGoal(
    userId: string,
    dto: CreateFinancialGoalDto,
  ): Promise<FinancialGoalEntity> {
    this.ensureFutureTargetDate(dto.targetDate);

    const goal = await this.financialGoalRepository.create({
      userId,
      name: dto.name,
      targetAmount: dto.targetAmount,
      currency: dto.currency,
      currentSavedAmount: dto.currentSavedAmount ?? 0,
      targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
      priority: dto.priority ?? null,
      notes: dto.notes ?? null,
    });

    return toFinancialGoalEntity(goal);
  }

  async getFinancialGoal(
    userId: string,
    id: string,
  ): Promise<FinancialGoalEntity> {
    const goal = await this.findOwnedGoal(userId, id);
    return toFinancialGoalEntity(goal);
  }

  async listFinancialGoals(
    userId: string,
    query: ListFinancialGoalsQueryDto,
  ): Promise<FinancialGoalEntity[]> {
    const goals = await this.financialGoalRepository.findAllByUser(userId, {
      status: query.status ?? FinancialGoalStatus.ACTIVE,
    });

    return goals.map(toFinancialGoalEntity);
  }

  async updateFinancialGoal(
    userId: string,
    id: string,
    dto: UpdateFinancialGoalDto,
  ): Promise<FinancialGoalEntity> {
    await this.findOwnedGoal(userId, id);

    if (dto.targetDate) {
      this.ensureFutureTargetDate(dto.targetDate);
    }

    const goal = await this.financialGoalRepository.update(id, {
      name: dto.name,
      targetAmount: dto.targetAmount,
      targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
      priority: dto.priority,
      notes: dto.notes,
    });

    return toFinancialGoalEntity(goal);
  }

  async updateSavedAmount(
    userId: string,
    id: string,
    dto: UpdateSavedAmountDto,
  ): Promise<FinancialGoalEntity> {
    await this.findOwnedGoal(userId, id);

    const goal = await this.financialGoalRepository.updateSavedAmount(
      id,
      dto.currentSavedAmount,
    );

    return toFinancialGoalEntity(goal);
  }

  async archiveFinancialGoal(
    userId: string,
    id: string,
  ): Promise<FinancialGoalEntity> {
    const existing = await this.findOwnedGoal(userId, id);

    if (existing.status === FinancialGoalStatus.ARCHIVED) {
      throw new ConflictException('Financial goal is already archived');
    }

    const goal = await this.financialGoalRepository.updateStatus(
      id,
      FinancialGoalStatus.ARCHIVED,
    );

    return toFinancialGoalEntity(goal);
  }

  async restoreFinancialGoal(
    userId: string,
    id: string,
  ): Promise<FinancialGoalEntity> {
    const existing = await this.findOwnedGoal(userId, id);

    if (existing.status !== FinancialGoalStatus.ARCHIVED) {
      throw new ConflictException('Financial goal is not archived');
    }

    const goal = await this.financialGoalRepository.updateStatus(
      id,
      FinancialGoalStatus.ACTIVE,
    );

    return toFinancialGoalEntity(goal);
  }

  async markAsAchieved(
    userId: string,
    id: string,
  ): Promise<FinancialGoalEntity> {
    const existing = await this.findOwnedGoal(userId, id);

    if (existing.status !== FinancialGoalStatus.ACTIVE) {
      throw new ConflictException(
        'Only an active financial goal can be marked as achieved',
      );
    }

    const goal = await this.financialGoalRepository.updateStatus(
      id,
      FinancialGoalStatus.ACHIEVED,
    );

    return toFinancialGoalEntity(goal);
  }

  async getFeasibility(
    userId: string,
    id: string,
  ): Promise<GoalFeasibilityResult> {
    const goal = await this.findOwnedGoal(userId, id);
    const now = new Date();
    const currentBounds = getMonthBoundaries(now);
    const nextBounds = getNextMonthBoundaries(now);

    const [currentPlan, nextPlan] = await Promise.all([
      this.spendingPlanService.getSpendingPlan(userId, {
        dateFrom: currentBounds.start.toISOString(),
        dateTo: currentBounds.end.toISOString(),
      }),
      this.spendingPlanService.getSpendingPlan(userId, {
        dateFrom: nextBounds.start.toISOString(),
        dateTo: nextBounds.end.toISOString(),
      }),
    ]);

    const currentAvailable = this.findAvailableForCurrency(
      currentPlan,
      goal.currency,
    );
    const nextAvailable = this.findAvailableForCurrency(
      nextPlan,
      goal.currency,
    );

    const feasibility = calculateFeasibility(
      goal.targetAmount.toNumber(),
      goal.currentSavedAmount.toNumber(),
      { ...currentBounds, available: currentAvailable },
      { ...nextBounds, available: nextAvailable },
    );

    return {
      goalId: goal.id,
      remainingNeeded: new Money(feasibility.remainingNeeded, goal.currency),
      affordableNow: feasibility.affordableNow,
      currentPeriod: {
        start: feasibility.currentPeriod.start,
        end: feasibility.currentPeriod.end,
        available:
          feasibility.currentPeriod.available !== null
            ? new Money(feasibility.currentPeriod.available, goal.currency)
            : null,
        affordable: feasibility.currentPeriod.affordable,
      },
      nextPeriod: {
        start: feasibility.nextPeriod.start,
        end: feasibility.nextPeriod.end,
        available:
          feasibility.nextPeriod.available !== null
            ? new Money(feasibility.nextPeriod.available, goal.currency)
            : null,
        affordable: feasibility.nextPeriod.affordable,
      },
      estimatedPeriodsLeft: feasibility.estimatedPeriodsLeft,
    };
  }

  private findAvailableForCurrency(
    plan: SpendingPlanResult,
    currency: string,
  ): number | null {
    const entry = plan.byCurrency.find(
      (currencyPlan) => currencyPlan.currency === currency,
    );

    return entry ? entry.available.amount : null;
  }

  private async findOwnedGoal(
    userId: string,
    id: string,
  ): Promise<FinancialGoal> {
    const goal = await this.financialGoalRepository.findById(id);

    if (!goal || goal.userId !== userId) {
      throw new NotFoundException('Financial goal not found');
    }

    return goal;
  }

  private ensureFutureTargetDate(targetDate?: string): void {
    if (!targetDate) {
      return;
    }

    if (new Date(targetDate) <= new Date()) {
      throw new BadRequestException('Target date must be in the future');
    }
  }
}
