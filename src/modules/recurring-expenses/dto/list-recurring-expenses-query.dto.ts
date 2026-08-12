import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { RecurringExpenseFrequency } from '../../../generated/prisma/client.js';

export class ListRecurringExpensesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @ApiPropertyOptional({ enum: RecurringExpenseFrequency })
  @IsOptional()
  @IsEnum(RecurringExpenseFrequency)
  frequency?: RecurringExpenseFrequency;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === undefined ? undefined : value === 'true',
  )
  @IsBoolean()
  active?: boolean;
}
