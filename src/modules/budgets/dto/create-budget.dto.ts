import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { SUPPORTED_CURRENCIES } from '../../../common/constants/currency.constants';
import { BudgetPeriod } from '../../../generated/prisma/client.js';
import { MAX_NAME_LENGTH } from '../constants/budgets.constants';

export class CreateBudgetDto {
  @ApiProperty({ example: 'Groceries budget' })
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  name: string;

  @ApiProperty({ description: 'Must reference an expense category' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 500 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({ enum: SUPPORTED_CURRENCIES, example: 'PEN' })
  @IsIn(SUPPORTED_CURRENCIES)
  currency: string;

  @ApiProperty({ enum: BudgetPeriod, example: BudgetPeriod.MONTHLY })
  @IsEnum(BudgetPeriod)
  period: BudgetPeriod;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-08-31' })
  @IsDateString()
  endDate: string;
}
