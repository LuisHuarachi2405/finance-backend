import { SavingsTarget } from '../../../generated/prisma/client.js';

export interface SavingsTargetRepository {
  findByUserId(userId: string): Promise<SavingsTarget | null>;
  upsert(userId: string, percentage: number): Promise<SavingsTarget>;
}
