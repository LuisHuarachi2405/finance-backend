import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { SUPPORTED_CURRENCIES } from '../../../common/constants/currency.constants';
import {
  MAX_NAME_LENGTH,
  SUPPORTED_LANGUAGES,
} from '../constants/users.constants';
import { IsIanaTimezone } from '../validators/is-iana-timezone.validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  lastName?: string;

  @ApiPropertyOptional({ example: '+50370000000' })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({ enum: SUPPORTED_CURRENCIES, example: 'PEN' })
  @IsOptional()
  @IsIn(SUPPORTED_CURRENCIES)
  preferredCurrency?: string;

  @ApiPropertyOptional({ example: 'America/Lima' })
  @IsOptional()
  @IsIanaTimezone()
  timezone?: string;

  @ApiPropertyOptional({ enum: SUPPORTED_LANGUAGES, example: 'es' })
  @IsOptional()
  @IsIn(SUPPORTED_LANGUAGES)
  language?: string;
}
