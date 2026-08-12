import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';
import { SUPPORTED_CURRENCIES } from '../../../common/constants/currency.constants';
import {
  MAX_NAME_LENGTH,
  MAX_NOTES_LENGTH,
} from '../constants/financial-goals.constants';

export class CreateFinancialGoalDto {
  @ApiProperty({ example: 'Buy glasses' })
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  name: string;

  @ApiProperty({ example: 2000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  targetAmount: number;

  @ApiProperty({ enum: SUPPORTED_CURRENCIES, example: 'PEN' })
  @IsIn(SUPPORTED_CURRENCIES)
  currency: string;

  @ApiPropertyOptional({ example: 500, default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  currentSavedAmount?: number;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @ApiPropertyOptional({ example: 1, description: 'Informational only' })
  @IsOptional()
  @IsInt()
  priority?: number;

  @ApiPropertyOptional({ example: 'Need new prescription glasses' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_NOTES_LENGTH)
  notes?: string;
}
