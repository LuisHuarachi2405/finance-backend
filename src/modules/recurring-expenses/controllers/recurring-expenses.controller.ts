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
import { CreateRecurringExpenseDto } from '../dto/create-recurring-expense.dto';
import { ListRecurringExpensesQueryDto } from '../dto/list-recurring-expenses-query.dto';
import { PayRecurringExpenseDto } from '../dto/pay-recurring-expense.dto';
import { ProjectedQueryDto } from '../dto/projected-query.dto';
import { UpdateRecurringExpenseDto } from '../dto/update-recurring-expense.dto';
import { RecurringExpensesService } from '../services/recurring-expenses.service';

@ApiTags('recurring-expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('recurring-expenses')
export class RecurringExpensesController {
  constructor(
    private readonly recurringExpensesService: RecurringExpensesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a recurring expense' })
  createRecurringExpense(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateRecurringExpenseDto,
  ) {
    return this.recurringExpensesService.createRecurringExpense(user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List recurring expenses owned by the authenticated user',
  })
  listRecurringExpenses(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListRecurringExpensesQueryDto,
  ) {
    return this.recurringExpensesService.listRecurringExpenses(user.id, query);
  }

  @Get('projected')
  @ApiOperation({
    summary: 'Get expected recurring expense occurrences for a date range',
  })
  getProjected(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ProjectedQueryDto,
  ) {
    return this.recurringExpensesService.getProjected(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recurring expense by id' })
  getRecurringExpense(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.recurringExpensesService.getRecurringExpense(user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a recurring expense' })
  updateRecurringExpense(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateRecurringExpenseDto,
  ) {
    return this.recurringExpensesService.updateRecurringExpense(
      user.id,
      id,
      dto,
    );
  }

  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a recurring expense' })
  archiveRecurringExpense(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.recurringExpensesService.archiveRecurringExpense(user.id, id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived recurring expense' })
  restoreRecurringExpense(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.recurringExpensesService.restoreRecurringExpense(user.id, id);
  }

  @Post(':id/pay')
  @ApiOperation({
    summary: 'Mark a recurring expense as paid for the current period',
  })
  payRecurringExpense(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: PayRecurringExpenseDto,
  ) {
    return this.recurringExpensesService.payRecurringExpense(user.id, id, dto);
  }
}
