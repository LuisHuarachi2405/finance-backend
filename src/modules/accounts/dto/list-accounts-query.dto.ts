import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AccountStatus } from '../../../generated/prisma/client.js';

export class ListAccountsQueryDto {
  @ApiPropertyOptional({ enum: AccountStatus, default: AccountStatus.ACTIVE })
  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;
}
