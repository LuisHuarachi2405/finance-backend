import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SavingsTarget } from '../../../generated/prisma/client.js';
import { SavingsTargetRepository } from '../interfaces/savings-target-repository.interface';

@Injectable()
export class PrismaSavingsTargetRepository implements SavingsTargetRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<SavingsTarget | null> {
    return this.prisma.savingsTarget.findUnique({ where: { userId } });
  }

  upsert(userId: string, percentage: number): Promise<SavingsTarget> {
    return this.prisma.savingsTarget.upsert({
      where: { userId },
      create: { userId, percentage },
      update: { percentage },
    });
  }
}
