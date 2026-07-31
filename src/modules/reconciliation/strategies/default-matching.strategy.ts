import { Injectable } from '@nestjs/common';
import {
  ImportedTransaction,
  Transaction,
} from '../../../generated/prisma/client.js';
import {
  AMOUNT_MATCH_EPSILON,
  DATE_SCORE_WEIGHT,
  DESCRIPTION_SCORE_WEIGHT,
  MAX_DATE_DIFFERENCE_DAYS,
  MIN_MATCH_SCORE,
} from '../constants/reconciliation.constants';
import {
  MatchCandidate,
  MatchingStrategy,
} from '../interfaces/matching-strategy.interface';

@Injectable()
export class DefaultMatchingStrategy implements MatchingStrategy {
  findBestMatch(
    importedTransaction: ImportedTransaction,
    candidates: Transaction[],
  ): MatchCandidate | null {
    let best: MatchCandidate | null = null;

    for (const transaction of candidates) {
      const score = this.calculateScore(importedTransaction, transaction);

      if (score !== null && score >= MIN_MATCH_SCORE) {
        if (!best || score > best.score) {
          best = { transaction, score };
        }
      }
    }

    return best;
  }

  private calculateScore(
    imported: ImportedTransaction,
    manual: Transaction,
  ): number | null {
    if (!this.amountsMatch(imported, manual)) {
      return null;
    }

    const dateScore = this.calculateDateScore(
      imported.transactionDate,
      manual.transactionDate,
    );
    const descriptionScore = this.calculateDescriptionScore(
      imported.description,
      manual.notes,
    );

    return Math.round(
      dateScore * DATE_SCORE_WEIGHT +
        descriptionScore * DESCRIPTION_SCORE_WEIGHT,
    );
  }

  private amountsMatch(
    imported: ImportedTransaction,
    manual: Transaction,
  ): boolean {
    const importedAmount = Math.abs(imported.amount.toNumber());
    const manualAmount = manual.amount.toNumber();
    return Math.abs(importedAmount - manualAmount) <= AMOUNT_MATCH_EPSILON;
  }

  private calculateDateScore(importedDate: Date, manualDate: Date): number {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const dayDifference = Math.abs(
      (importedDate.getTime() - manualDate.getTime()) / millisecondsPerDay,
    );

    if (dayDifference >= MAX_DATE_DIFFERENCE_DAYS) {
      return 0;
    }

    return 1 - dayDifference / MAX_DATE_DIFFERENCE_DAYS;
  }

  private calculateDescriptionScore(
    importedDescription: string,
    manualNotes: string | null,
  ): number {
    const importedWords = this.tokenize(importedDescription);
    const manualWords = this.tokenize(manualNotes ?? '');

    if (importedWords.size === 0 || manualWords.size === 0) {
      return 0;
    }

    const intersection = new Set(
      [...importedWords].filter((word) => manualWords.has(word)),
    );
    const union = new Set([...importedWords, ...manualWords]);

    return intersection.size / union.size;
  }

  private tokenize(value: string): Set<string> {
    return new Set(
      value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 0),
    );
  }
}
