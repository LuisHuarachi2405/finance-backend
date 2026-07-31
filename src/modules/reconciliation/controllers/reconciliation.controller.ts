import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ConfirmMatchDto } from '../dto/confirm-match.dto';
import { IgnoreImportedTransactionDto } from '../dto/ignore-imported-transaction.dto';
import { ListCandidatesQueryDto } from '../dto/list-candidates-query.dto';
import { ListHistoryQueryDto } from '../dto/list-history-query.dto';
import { RejectMatchDto } from '../dto/reject-match.dto';
import { ReconciliationService } from '../services/reconciliation.service';

@ApiTags('reconciliation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reconciliation')
export class ReconciliationController {
  constructor(private readonly reconciliationService: ReconciliationService) {}

  @Get('candidates')
  @ApiOperation({
    summary: 'Get suggested matches for unreconciled imported transactions',
  })
  getCandidates(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListCandidatesQueryDto,
  ) {
    return this.reconciliationService.getCandidates(user.id, query.accountId);
  }

  @Post('matches')
  @ApiOperation({ summary: 'Confirm a match between two transactions' })
  confirmMatch(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ConfirmMatchDto,
  ) {
    return this.reconciliationService.confirmMatch(user.id, dto);
  }

  @Post('matches/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a suggested match' })
  rejectMatch(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RejectMatchDto,
  ) {
    return this.reconciliationService.rejectMatch(user.id, dto);
  }

  @Post('matches/ignore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark an imported transaction as ignored' })
  ignoreImportedTransaction(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: IgnoreImportedTransactionDto,
  ) {
    return this.reconciliationService.ignoreImportedTransaction(user.id, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get the reconciliation decision history' })
  getHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListHistoryQueryDto,
  ) {
    return this.reconciliationService.getHistory(user.id, query);
  }
}
