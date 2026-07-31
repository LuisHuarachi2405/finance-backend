import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PeriodFilterQueryDto } from './period-filter-query.dto';

export const CASH_FLOW_GROUP_BY_VALUES = ['day', 'week', 'month'] as const;

export class CashFlowQueryDto extends PeriodFilterQueryDto {
  @ApiPropertyOptional({ enum: CASH_FLOW_GROUP_BY_VALUES, default: 'month' })
  @IsOptional()
  @IsIn(CASH_FLOW_GROUP_BY_VALUES)
  groupBy?: (typeof CASH_FLOW_GROUP_BY_VALUES)[number];
}
