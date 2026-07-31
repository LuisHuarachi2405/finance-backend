export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export const MAX_NAME_LENGTH = 100;

export const SUPPORTED_LANGUAGES = ['es', 'en'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
