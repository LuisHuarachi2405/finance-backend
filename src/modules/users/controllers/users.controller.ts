import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserEntity } from '../entities/user.entity';
import { toUserEntity } from '../mappers/user.mapper';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  async getProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserEntity> {
    const profile = await this.usersService.getProfile(user.id);
    return toUserEntity(profile);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserEntity> {
    const profile = await this.usersService.updateProfile(user.id, dto);
    return toUserEntity(profile);
  }
}
