import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { ImportFileFormat } from '../../../generated/prisma/client.js';

export function readFileAsRows(
  buffer: Buffer,
  fileFormat: ImportFileFormat,
): Record<string, string>[] {
  if (fileFormat === ImportFileFormat.CSV) {
    return parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  }

  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error('The file does not contain any sheets');
  }

  const sheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    raw: false,
    defval: '',
  });
}
