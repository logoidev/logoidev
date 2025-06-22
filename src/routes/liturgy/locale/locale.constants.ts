import type { Locale, LocaleCode } from './locale.schema';

export const DEFAULT_LOCALE_CODE: LocaleCode = 'en';

export const LOCALES = [
	{ name: 'English', code: 'en' },
	{ name: 'Ukrainian', code: 'uk' }
] as const satisfies Locale[];

export const DEFAULT_LOCALE = LOCALES.find((locale) => locale.code === DEFAULT_LOCALE_CODE)!;
