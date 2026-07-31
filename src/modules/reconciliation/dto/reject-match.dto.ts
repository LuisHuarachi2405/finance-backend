import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RejectMatchDto {
  @ApiProperty()
  @IsUUID()
  importedTransactionId: string;

  @ApiProperty()
  @IsUUID()
  transactionId: string;
}
