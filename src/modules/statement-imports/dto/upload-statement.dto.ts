import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ImportProvider } from '../../../generated/prisma/client.js';

export class UploadStatementDto {
  @ApiProperty({ enum: ImportProvider, example: ImportProvider.YAPE })
  @IsEnum(ImportProvider)
  provider: ImportProvider;

  @ApiProperty({ description: 'Account this statement will be imported into' })
  @IsUUID()
  accountId: string;

  @ApiProperty({ example: 'Fecha' })
  @IsString()
  dateColumn: string;

  @ApiProperty({ example: 'Descripcion' })
  @IsString()
  descriptionColumn: string;

  @ApiProperty({ example: 'Monto' })
  @IsString()
  amountColumn: string;

  @ApiPropertyOptional({ example: 'Moneda' })
  @IsOptional()
  @IsString()
  currencyColumn?: string;

  @ApiPropertyOptional({ example: 'Id' })
  @IsOptional()
  @IsString()
  externalIdColumn?: string;

  @ApiPropertyOptional({ example: 'Referencia' })
  @IsOptional()
  @IsString()
  referenceColumn?: string;

  @ApiPropertyOptional({
    example: 'DD/MM/YYYY',
    description: 'Only needed when dates are not ISO 8601',
  })
  @IsOptional()
  @IsString()
  dateFormat?: string;
}
