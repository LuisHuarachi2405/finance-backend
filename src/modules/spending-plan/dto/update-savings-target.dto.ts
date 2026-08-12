import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class UpdateSavingsTargetDto {
  @ApiProperty({ example: 20, description: 'Percentage of income, 0-100' })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;
}
