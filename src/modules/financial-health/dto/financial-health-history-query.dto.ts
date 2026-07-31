import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PeriodFilterQueryDto } from '../../reports/dto/period-filter-query.dto';

export const FINANCIAL_HEALTH_GROUP_BY_VALUES = ['week', 'month'] as const;

export class FinancialHealthHistoryQueryDto extends PeriodFilterQueryDto {
  @ApiPropertyOptional({
    enum: FINANCIAL_HEALTH_GROUP_BY_VALUES,
    default: 'month',
  })
  @IsOptional()
  @IsIn(FINANCIAL_HEALTH_GROUP_BY_VALUES)
  groupBy?: (typeof FINANCIAL_HEALTH_GROUP_BY_VALUES)[number];
}
