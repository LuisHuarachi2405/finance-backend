import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { AccountType } from '../../../generated/prisma/client.js';
import {
  MAX_ACCOUNT_NAME_LENGTH,
  MAX_INSTITUTION_LENGTH,
  MAX_NOTES_LENGTH,
} from '../constants/accounts.constants';

export class UpdateAccountDto {
  @ApiPropertyOptional({ example: 'BCP Savings Account' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_ACCOUNT_NAME_LENGTH)
  name?: string;

  @ApiPropertyOptional({ example: 'BCP' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_INSTITUTION_LENGTH)
  institution?: string;

  @ApiPropertyOptional({ enum: AccountType, example: AccountType.BANK_ACCOUNT })
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @ApiPropertyOptional({ example: 'Primary salary account' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_NOTES_LENGTH)
  notes?: string;
}
