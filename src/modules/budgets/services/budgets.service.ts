import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from '../../categories/services/categories.service';
import { TransactionsService } from '../../transactions/services/transactions.service';
import { Budget, CategoryType } from '../../../generated/prisma/client.js';
import { BUDGET_REPOSITORY } from '../constants/budgets.constants';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { ListBudgetsQueryDto } from '../dto/list-budgets-query.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { BudgetEntity } from '../entities/budget.entity';
import type { BudgetRepository } from '../interfaces/budget-repository.interface';
import { toBudgetEntity } from '../mappers/budget.mapper';

@Injectable()
export class BudgetsService {
  constructor(
    @Inject(BUDGET_REPOSITORY)
    private readonly budgetRepository: BudgetRepository,
    private readonly categoriesService: CategoriesService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async createBudget(
    userId: string,
    dto: CreateBudgetDto,
  ): Promise<BudgetEntity> {
    await this.ensureCategoryIsExpense(userId, dto.categoryId);
    this.ensureValidDateRange(dto.startDate, dto.endDate);

    const budget = await this.budgetRepository.create({
      userId,
      categoryId: dto.categoryId,
      name: dto.name,
      amount: dto.amount,
      currency: dto.currency,
      period: dto.period,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });

    return this.toEntity(userId, budget);
  }

  async getBudget(userId: string, id: string): Promise<BudgetEntity> {
    const budget = await this.findOwnedBudget(userId, id);
    return this.toEntity(userId, budget);
  }

  async listBudgets(
    userId: string,
    query: ListBudgetsQueryDto,
  ): Promise<BudgetEntity[]> {
    const budgets = await this.budgetRepository.findAllByUser(userId, {
      categoryId: query.categoryId,
      period: query.period,
      active: query.active ?? true,
    });

    return Promise.all(budgets.map((budget) => this.toEntity(userId, budget)));
  }

  async updateBudget(
    userId: string,
    id: string,
    dto: UpdateBudgetDto,
  ): Promise<BudgetEntity> {
    const existing = await this.findOwnedBudget(userId, id);

    const nextStartDate = dto.startDate
      ? new Date(dto.startDate)
      : existing.startDate;
    const nextEndDate = dto.endDate ? new Date(dto.endDate) : existing.endDate;
    this.ensureValidDateRange(nextStartDate, nextEndDate);

    const budget = await this.budgetRepository.update(id, {
      name: dto.name,
      amount: dto.amount,
      period: dto.period,
      startDate: dto.startDate ? nextStartDate : undefined,
      endDate: dto.endDate ? nextEndDate : undefined,
    });

    return this.toEntity(userId, budget);
  }

  async archiveBudget(userId: string, id: string): Promise<BudgetEntity> {
    const existing = await this.findOwnedBudget(userId, id);

    if (!existing.active) {
      throw new ConflictException('Budget is already archived');
    }

    const budget = await this.budgetRepository.updateActive(id, false);
    return this.toEntity(userId, budget);
  }

  async restoreBudget(userId: string, id: string): Promise<BudgetEntity> {
    const existing = await this.findOwnedBudget(userId, id);

    if (existing.active) {
      throw new ConflictException('Budget is already active');
    }

    const budget = await this.budgetRepository.updateActive(id, true);
    return this.toEntity(userId, budget);
  }

  private async findOwnedBudget(userId: string, id: string): Promise<Budget> {
    const budget = await this.budgetRepository.findById(id);

    if (!budget || budget.userId !== userId) {
      throw new NotFoundException('Budget not found');
    }

    return budget;
  }

  private async toEntity(
    userId: string,
    budget: Budget,
  ): Promise<BudgetEntity> {
    const spentAmount = await this.transactionsService.sumActiveExpenses(
      userId,
      budget.categoryId,
      budget.currency,
      budget.startDate,
      budget.endDate,
    );

    return toBudgetEntity(budget, spentAmount);
  }

  private async ensureCategoryIsExpense(
    userId: string,
    categoryId: string,
  ): Promise<void> {
    const category = await this.categoriesService.getCategory(
      userId,
      categoryId,
    );

    if (category.type !== CategoryType.EXPENSE) {
      throw new BadRequestException(
        'Budgets can only be associated with expense categories',
      );
    }
  }

  private ensureValidDateRange(
    startDate: Date | string,
    endDate: Date | string,
  ): void {
    if (new Date(endDate) <= new Date(startDate)) {
      throw new BadRequestException('End date must be after start date');
    }
  }
}
