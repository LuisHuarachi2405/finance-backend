import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateSavedAmountDto {
  @ApiProperty({ example: 800 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  currentSavedAmount: number;
}
