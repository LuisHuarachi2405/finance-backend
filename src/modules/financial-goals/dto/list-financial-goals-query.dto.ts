import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { FinancialGoalStatus } from '../../../generated/prisma/client.js';

export class ListFinancialGoalsQueryDto {
  @ApiPropertyOptional({
    enum: FinancialGoalStatus,
    default: FinancialGoalStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(FinancialGoalStatus)
  status?: FinancialGoalStatus;
}
