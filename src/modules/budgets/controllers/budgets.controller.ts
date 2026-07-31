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
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { ListBudgetsQueryDto } from '../dto/list-budgets-query.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { BudgetEntity } from '../entities/budget.entity';
import { BudgetsService } from '../services/budgets.service';

@ApiTags('budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a budget' })
  createBudget(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBudgetDto,
  ): Promise<BudgetEntity> {
    return this.budgetsService.createBudget(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List budgets owned by the authenticated user' })
  listBudgets(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListBudgetsQueryDto,
  ): Promise<BudgetEntity[]> {
    return this.budgetsService.listBudgets(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a budget by id' })
  getBudget(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<BudgetEntity> {
    return this.budgetsService.getBudget(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a budget' })
  updateBudget(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateBudgetDto,
  ): Promise<BudgetEntity> {
    return this.budgetsService.updateBudget(user.id, id, dto);
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a budget' })
  archiveBudget(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<BudgetEntity> {
    return this.budgetsService.archiveBudget(user.id, id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived budget' })
  restoreBudget(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<BudgetEntity> {
    return this.budgetsService.restoreBudget(user.id, id);
  }
}
