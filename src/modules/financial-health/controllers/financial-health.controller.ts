import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PeriodFilterQueryDto } from '../../reports/dto/period-filter-query.dto';
import { FinancialHealthHistoryQueryDto } from '../dto/financial-health-history-query.dto';
import { FinancialHealthService } from '../services/financial-health.service';

@ApiTags('financial-health')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('financial-health')
export class FinancialHealthController {
  constructor(
    private readonly financialHealthService: FinancialHealthService,
  ) {}

  @Get('score')
  @ApiOperation({ summary: 'Get the financial health score for a period' })
  getScore(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PeriodFilterQueryDto,
  ) {
    return this.financialHealthService.getScore(user.id, query);
  }

  @Get('indicators')
  @ApiOperation({ summary: 'Get financial indicators for a period' })
  getIndicators(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PeriodFilterQueryDto,
  ) {
    return this.financialHealthService.getIndicators(user.id, query);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get historical financial health scores' })
  getHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: FinancialHealthHistoryQueryDto,
  ) {
    return this.financialHealthService.getHistory(user.id, query);
  }
}
