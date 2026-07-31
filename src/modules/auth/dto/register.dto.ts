import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MAX_NAME_LENGTH } from '../../users/constants/users.constants';

export class RegisterDto {
  @ApiProperty({ example: 'johndoe' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: '+50370000000' })
  @IsPhoneNumber()
  phoneNumber: string;
}
