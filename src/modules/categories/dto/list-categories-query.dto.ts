import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { CategoryType } from '../../../generated/prisma/client.js';

export class ListCategoriesQueryDto {
  @ApiPropertyOptional({ enum: CategoryType })
  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === undefined ? undefined : value === 'true',
  )
  @IsBoolean()
  active?: boolean;
}
