import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../auth/decorators/current-user.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MAX_FILE_SIZE_BYTES } from '../constants/statement-imports.constants';
import { ListStatementsQueryDto } from '../dto/list-statements-query.dto';
import { UploadStatementDto } from '../dto/upload-statement.dto';
import { MulterExceptionFilter } from '../filters/multer-exception.filter';
import { StatementImportsService } from '../services/statement-imports.service';

@ApiTags('statement-imports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseFilters(MulterExceptionFilter)
@Controller('statement-imports')
export class StatementImportsController {
  constructor(
    private readonly statementImportsService: StatementImportsService,
  ) {}

  @Post('preview')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE_BYTES } }),
  )
  @ApiOperation({
    summary: 'Parse and validate a statement file without persisting it',
  })
  previewStatement(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UploadStatementDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.statementImportsService.previewStatement(user.id, dto, file);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE_BYTES } }),
  )
  @ApiOperation({ summary: 'Import a statement file into an account' })
  importStatement(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UploadStatementDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.statementImportsService.importStatement(user.id, dto, file);
  }

  @Get()
  @ApiOperation({ summary: 'List import history for the authenticated user' })
  listStatements(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListStatementsQueryDto,
  ) {
    return this.statementImportsService.listStatements(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a statement by id' })
  getStatement(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.statementImportsService.getStatement(user.id, id);
  }

  @Get(':id/transactions')
  @ApiOperation({ summary: 'Get the transactions imported from a statement' })
  getImportedTransactions(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.statementImportsService.getImportedTransactions(user.id, id);
  }
}
