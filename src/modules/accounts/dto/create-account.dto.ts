import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SUPPORTED_CURRENCIES } from '../../../common/constants/currency.constants';
import { AccountType } from '../../../generated/prisma/client.js';
import {
  MAX_ACCOUNT_NAME_LENGTH,
  MAX_INSTITUTION_LENGTH,
  MAX_NOTES_LENGTH,
} from '../constants/accounts.constants';

export class CreateAccountDto {
  @ApiProperty({ example: 'BCP Savings Account' })
  @IsString()
  @MaxLength(MAX_ACCOUNT_NAME_LENGTH)
  name: string;

  @ApiPropertyOptional({ example: 'BCP' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_INSTITUTION_LENGTH)
  institution?: string;

  @ApiProperty({ enum: AccountType, example: AccountType.BANK_ACCOUNT })
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiProperty({ enum: SUPPORTED_CURRENCIES, example: 'PEN' })
  @IsIn(SUPPORTED_CURRENCIES)
  currency: string;

  @ApiProperty({ example: 1000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  initialBalance: number;

  @ApiPropertyOptional({ example: 'Primary salary account' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_NOTES_LENGTH)
  notes?: string;
}
