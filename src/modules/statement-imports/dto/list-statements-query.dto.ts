import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import {
  ImportProvider,
  ImportStatus,
} from '../../../generated/prisma/client.js';

export class ListStatementsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @ApiPropertyOptional({ enum: ImportProvider })
  @IsOptional()
  @IsEnum(ImportProvider)
  provider?: ImportProvider;

  @ApiPropertyOptional({ enum: ImportStatus })
  @IsOptional()
  @IsEnum(ImportStatus)
  status?: ImportStatus;
}
