import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateFinancialGoalDto } from '../dto/create-financial-goal.dto';
import { ListFinancialGoalsQueryDto } from '../dto/list-financial-goals-query.dto';
import { UpdateFinancialGoalDto } from '../dto/update-financial-goal.dto';
import { UpdateSavedAmountDto } from '../dto/update-saved-amount.dto';
import { FinancialGoalsService } from '../services/financial-goals.service';

@ApiTags('financial-goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('financial-goals')
export class FinancialGoalsController {
  constructor(private readonly financialGoalsService: FinancialGoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a financial goal' })
  createFinancialGoal(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateFinancialGoalDto,
  ) {
    return this.financialGoalsService.createFinancialGoal(user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List financial goals owned by the authenticated user',
  })
  listFinancialGoals(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListFinancialGoalsQueryDto,
  ) {
    return this.financialGoalsService.listFinancialGoals(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a financial goal by id' })
  getFinancialGoal(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.financialGoalsService.getFinancialGoal(user.id, id);
  }

  @Get(':id/feasibility')
  @ApiOperation({
    summary:
      'Evaluate whether a financial goal is affordable using the Spending Plan',
  })
  getFeasibility(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.financialGoalsService.getFeasibility(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a financial goal' })
  updateFinancialGoal(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateFinancialGoalDto,
  ) {
    return this.financialGoalsService.updateFinancialGoal(user.id, id, dto);
  }

  @Patch(':id/saved-amount')
  @ApiOperation({ summary: 'Update the current saved amount' })
  updateSavedAmount(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateSavedAmountDto,
  ) {
    return this.financialGoalsService.updateSavedAmount(user.id, id, dto);
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a financial goal' })
  archiveFinancialGoal(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.financialGoalsService.archiveFinancialGoal(user.id, id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived financial goal' })
  restoreFinancialGoal(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.financialGoalsService.restoreFinancialGoal(user.id, id);
  }

  @Patch(':id/achieve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark a financial goal as achieved' })
  markAsAchieved(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.financialGoalsService.markAsAchieved(user.id, id);
  }
}
