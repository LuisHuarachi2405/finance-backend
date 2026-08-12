import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class SpendingPlanQueryDto {
  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  dateFrom: string;

  @ApiProperty({ example: '2026-08-31' })
  @IsDateString()
  dateTo: string;
}
