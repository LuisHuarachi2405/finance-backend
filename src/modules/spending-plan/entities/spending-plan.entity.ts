import { Money } from '../../../common/value-objects/money.value-object';

export interface CurrencySpendingPlan {
  currency: string;
  income: Money;
  committedExpenses: Money;
  otherExpenses: Money;
  savingsTarget: Money;
  available: Money;
  committedPercentage: number;
  otherPercentage: number;
  savingsTargetPercentage: number;
  availablePercentage: number;
}

export class SpendingPlanResult {
  dateFrom: Date;
  dateTo: Date;
  savingsTargetPercentage: number;
  byCurrency: CurrencySpendingPlan[];
}

export class SavingsTargetEntity {
  percentage: number;
  updatedAt: Date | null;
}
