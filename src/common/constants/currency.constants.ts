export const SUPPORTED_CURRENCIES = ['PEN', 'USD'] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
