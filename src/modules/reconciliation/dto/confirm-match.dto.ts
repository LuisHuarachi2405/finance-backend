import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ConfirmMatchDto {
  @ApiProperty()
  @IsUUID()
  importedTransactionId: string;

  @ApiProperty()
  @IsUUID()
  transactionId: string;
}
