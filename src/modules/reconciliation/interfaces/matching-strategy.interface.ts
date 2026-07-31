import {
  ImportedTransaction,
  Transaction,
} from '../../../generated/prisma/client.js';

export interface MatchCandidate {
  transaction: Transaction;
  score: number;
}

export interface MatchingStrategy {
  findBestMatch(
    importedTransaction: ImportedTransaction,
    candidates: Transaction[],
  ): MatchCandidate | null;
}
