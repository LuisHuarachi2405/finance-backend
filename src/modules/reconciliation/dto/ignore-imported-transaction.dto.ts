import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IgnoreImportedTransactionDto {
  @ApiProperty()
  @IsUUID()
  importedTransactionId: string;
}
