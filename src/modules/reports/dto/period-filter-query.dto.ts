import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class PeriodFilterQueryDto {
  @ApiProperty({ example: '2026-07-01' })
  @IsDateString()
  dateFrom: string;

  @ApiProperty({ example: '2026-07-31' })
  @IsDateString()
  dateTo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  accountId?: string;
}
