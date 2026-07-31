import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { TransactionType } from '../../../generated/prisma/client.js';
import { PeriodFilterQueryDto } from './period-filter-query.dto';

export const CATEGORY_BREAKDOWN_TYPES = [
  TransactionType.EXPENSE,
  TransactionType.INCOME,
] as const;

export class CategoryBreakdownQueryDto extends PeriodFilterQueryDto {
  @ApiProperty({
    enum: CATEGORY_BREAKDOWN_TYPES,
    example: TransactionType.EXPENSE,
  })
  @IsIn(CATEGORY_BREAKDOWN_TYPES)
  type: (typeof CATEGORY_BREAKDOWN_TYPES)[number];
}
