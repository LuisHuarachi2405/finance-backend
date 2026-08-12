import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SpendingPlanQueryDto } from '../dto/spending-plan-query.dto';
import { UpdateSavingsTargetDto } from '../dto/update-savings-target.dto';
import { SpendingPlanService } from '../services/spending-plan.service';

@ApiTags('spending-plan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('spending-plan')
export class SpendingPlanController {
  constructor(private readonly spendingPlanService: SpendingPlanService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get the income/committed/other/savings/available breakdown for a period',
  })
  getSpendingPlan(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: SpendingPlanQueryDto,
  ) {
    return this.spendingPlanService.getSpendingPlan(user.id, query);
  }

  @Get('savings-target')
  @ApiOperation({ summary: 'Get the configured savings target percentage' })
  getSavingsTarget(@CurrentUser() user: AuthenticatedUser) {
    return this.spendingPlanService.getSavingsTarget(user.id);
  }

  @Patch('savings-target')
  @ApiOperation({ summary: 'Update the savings target percentage' })
  updateSavingsTarget(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateSavingsTargetDto,
  ) {
    return this.spendingPlanService.updateSavingsTarget(user.id, dto);
  }
}
