import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { TransactionType } from '../../../generated/prisma/client.js';
import { MAX_NOTES_LENGTH } from '../constants/transactions.constants';

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionType, example: TransactionType.EXPENSE })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ description: 'Source account id' })
  @IsUUID()
  accountId: string;

  @ApiPropertyOptional({
    description: 'Destination account id, required only for transfers',
  })
  @IsOptional()
  @IsUUID()
  toAccountId?: string;

  @ApiPropertyOptional({
    description: 'Required for expense and income, forbidden for transfers',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ example: 150.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({ example: '2026-07-30' })
  @IsDateString()
  transactionDate: string;

  @ApiPropertyOptional({ example: 'Weekly groceries' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_NOTES_LENGTH)
  notes?: string;
}
