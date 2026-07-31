import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';
import { TokensDto } from './tokens.dto';

export class AuthResponseDto {
  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  @ApiProperty({ type: TokensDto })
  tokens: TokensDto;
}
