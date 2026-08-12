import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { RecurringExpenseFrequency } from '../../../generated/prisma/client.js';
import { MAX_NAME_LENGTH } from '../constants/recurring-expenses.constants';

export class CreateRecurringExpenseDto {
  @ApiProperty({ example: 'Rent' })
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  name: string;

  @ApiProperty({ description: 'Must reference an expense category' })
  @IsUUID()
  categoryId: string;

  @ApiProperty()
  @IsUUID()
  accountId: string;

  @ApiProperty({ example: 1000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({
    enum: RecurringExpenseFrequency,
    example: RecurringExpenseFrequency.MONTHLY,
  })
  @IsEnum(RecurringExpenseFrequency)
  frequency: RecurringExpenseFrequency;

  @ApiPropertyOptional({
    example: 5,
    description: 'Required when frequency is MONTHLY (1-31)',
  })
  @ValidateIf(
    (dto: CreateRecurringExpenseDto) =>
      dto.frequency === RecurringExpenseFrequency.MONTHLY,
  )
  @IsInt()
  @Min(1)
  @Max(31)
  dayOfMonth?: number;

  @ApiPropertyOptional({
    example: 1,
    description:
      'Required when frequency is WEEKLY (0=Sunday..6=Saturday, matches JS Date.getDay())',
  })
  @ValidateIf(
    (dto: CreateRecurringExpenseDto) =>
      dto.frequency === RecurringExpenseFrequency.WEEKLY,
  )
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @ApiProperty({ example: '2026-01-01' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
