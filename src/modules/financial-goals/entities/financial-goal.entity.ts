import { FinancialGoalStatus } from '../../../generated/prisma/client.js';
import { Money } from '../../../common/value-objects/money.value-object';

export class FinancialGoalEntity {
  id: string;
  userId: string;
  name: string;
  targetAmount: Money;
  currentSavedAmount: Money;
  targetDate: Date | null;
  priority: number | null;
  status: FinancialGoalStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PeriodAvailability {
  start: Date;
  end: Date;
  available: Money | null;
  affordable: boolean | null;
}

export interface GoalFeasibilityResult {
  goalId: string;
  remainingNeeded: Money;
  affordableNow: boolean;
  currentPeriod: PeriodAvailability;
  nextPeriod: PeriodAvailability;
  estimatedPeriodsLeft: number | null;
}

export interface PeriodBounds {
  start: Date;
  end: Date;
}

export function getMonthBoundaries(referenceDate: Date): PeriodBounds {
  const start = new Date(
    Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), 1),
  );
  const end = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    ),
  );

  return { start, end };
}

export function getNextMonthBoundaries(referenceDate: Date): PeriodBounds {
  const nextMonthDate = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth() + 1,
      1,
    ),
  );

  return getMonthBoundaries(nextMonthDate);
}

export interface RawPeriodAvailability extends PeriodBounds {
  available: number | null;
}

export interface RawGoalFeasibility {
  remainingNeeded: number;
  affordableNow: boolean;
  currentPeriod: RawPeriodAvailability & { affordable: boolean | null };
  nextPeriod: RawPeriodAvailability & { affordable: boolean | null };
  estimatedPeriodsLeft: number | null;
}

export function calculateFeasibility(
  targetAmount: number,
  currentSavedAmount: number,
  currentPeriod: RawPeriodAvailability,
  nextPeriod: RawPeriodAvailability,
): RawGoalFeasibility {
  const remainingNeeded = Math.max(targetAmount - currentSavedAmount, 0);
  const affordableNow = currentSavedAmount >= targetAmount;

  const estimatedPeriodsLeft =
    currentPeriod.available !== null && currentPeriod.available > 0
      ? remainingNeeded / currentPeriod.available
      : null;

  return {
    remainingNeeded,
    affordableNow,
    currentPeriod: {
      ...currentPeriod,
      affordable:
        currentPeriod.available !== null
          ? remainingNeeded <= currentPeriod.available
          : null,
    },
    nextPeriod: {
      ...nextPeriod,
      affordable:
        nextPeriod.available !== null
          ? remainingNeeded <= nextPeriod.available
          : null,
    },
    estimatedPeriodsLeft,
  };
}
