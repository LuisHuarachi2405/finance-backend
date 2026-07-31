import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ListBudgetsQueryDto } from '../../budgets/dto/list-budgets-query.dto';
import { BalanceHistoryQueryDto } from '../dto/balance-history-query.dto';
import { CashFlowQueryDto } from '../dto/cash-flow-query.dto';
import { CategoryBreakdownQueryDto } from '../dto/category-breakdown-query.dto';
import { PeriodFilterQueryDto } from '../dto/period-filter-query.dto';
import { ReportsService } from '../services/reports.service';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Income, expenses and net balance for a date range',
  })
  getSummary(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: PeriodFilterQueryDto,
  ) {
    return this.reportsService.getSummary(user.id, query);
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Expense or income breakdown by category' })
  getCategoryBreakdown(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: CategoryBreakdownQueryDto,
  ) {
    return this.reportsService.getCategoryBreakdown(user.id, query);
  }

  @Get('cash-flow')
  @ApiOperation({ summary: 'Income vs expenses bucketed over time' })
  getCashFlow(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: CashFlowQueryDto,
  ) {
    return this.reportsService.getCashFlow(user.id, query);
  }

  @Get('accounts/:accountId/balance-history')
  @ApiOperation({ summary: 'Running balance history for an account' })
  getBalanceHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('accountId') accountId: string,
    @Query() query: BalanceHistoryQueryDto,
  ) {
    return this.reportsService.getBalanceHistory(user.id, accountId, query);
  }

  @Get('budget-performance')
  @ApiOperation({ summary: 'Spending progress for active or archived budgets' })
  getBudgetPerformance(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListBudgetsQueryDto,
  ) {
    return this.reportsService.getBudgetPerformance(user.id, query);
  }
}
