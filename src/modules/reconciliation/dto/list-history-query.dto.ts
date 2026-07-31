import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ReconciliationStatus } from '../../../generated/prisma/client.js';

export class ListHistoryQueryDto {
  @ApiPropertyOptional({ enum: ReconciliationStatus })
  @IsOptional()
  @IsEnum(ReconciliationStatus)
  status?: ReconciliationStatus;
}
