import { BadRequestException, Injectable } from '@nestjs/common';
import { ImportProvider } from '../../../generated/prisma/client.js';
import { StatementParser } from '../interfaces/statement-parser.interface';
import { GenericColumnMappingParser } from './generic-column-mapping.parser';

@Injectable()
export class StatementParserRegistry {
  private readonly parsers = new Map<ImportProvider, StatementParser>();

  constructor(genericParser: GenericColumnMappingParser) {
    this.parsers.set(ImportProvider.YAPE, genericParser);
  }

  getParser(provider: ImportProvider): StatementParser {
    const parser = this.parsers.get(provider);

    if (!parser) {
      throw new BadRequestException(`Unsupported provider: ${provider}`);
    }

    return parser;
  }
}
