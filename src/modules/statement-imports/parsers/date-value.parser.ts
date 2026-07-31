export function parseDateValue(value: string, format?: string): Date {
  if (format) {
    const parsed = parseWithFormat(value, format);

    if (!parsed) {
      throw new Error(
        `Value "${value}" does not match date format "${format}"`,
      );
    }

    return parsed;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Value "${value}" is not a valid date`);
  }

  return parsed;
}

function parseWithFormat(value: string, format: string): Date | null {
  const formatTokens = format.match(/YYYY|MM|DD/g);
  const delimiterMatch = format.match(/[^A-Za-z]+/);

  if (!formatTokens || !delimiterMatch) {
    return null;
  }

  const valueParts = value.split(delimiterMatch[0]);

  if (valueParts.length !== formatTokens.length) {
    return null;
  }

  const components: Record<string, number> = {};
  formatTokens.forEach((token, index) => {
    components[token] = Number(valueParts[index]);
  });

  const { YYYY: year, MM: month, DD: day } = components;

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return Number.isNaN(date.getTime()) ? null : date;
}
