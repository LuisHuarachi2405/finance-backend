import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { CategoryType } from '../../../generated/prisma/client.js';
import {
  MAX_COLOR_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_ICON_LENGTH,
  MAX_NAME_LENGTH,
} from '../constants/categories.constants';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Food' })
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  name: string;

  @ApiProperty({ enum: CategoryType, example: CategoryType.EXPENSE })
  @IsEnum(CategoryType)
  type: CategoryType;

  @ApiPropertyOptional({ example: 'Groceries and dining out' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_DESCRIPTION_LENGTH)
  description?: string;

  @ApiPropertyOptional({ example: '#FF5733' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_COLOR_LENGTH)
  color?: string;

  @ApiPropertyOptional({ example: 'fork-knife' })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_ICON_LENGTH)
  icon?: string;
}
