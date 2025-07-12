import { z } from 'zod';

const englishLocale = {
	name: 'English',
	localName: 'English',
	code: 'en',
	flag: '🇺🇸'
} as const;

const ukrainianLocale = {
	name: 'Ukrainian',
	localName: 'Українська',
	code: 'uk',
	flag: '🇺🇦'
} as const;

const russianLocale = {
	name: 'Russian',
	localName: 'Русский',
	code: 'ru',
	flag: '🇷🇺'
} as const;

export const LOCALES = [englishLocale, ukrainianLocale, russianLocale] as const;

export const LOCALES_CODES = [
	englishLocale.code,
	ukrainianLocale.code,
	russianLocale.code
] as const;

export const DEFAULT_LOCALE = englishLocale;

const englishLocaleSchema = z.object({
	name: z.literal(englishLocale.name),
	code: z.literal(englishLocale.code),
	flag: z.literal(englishLocale.flag)
});

const ukrainianLocaleSchema = z.object({
	name: z.literal(ukrainianLocale.name),
	code: z.literal(ukrainianLocale.code),
	flag: z.literal(ukrainianLocale.flag)
});

const russianLocaleSchema = z.object({
	name: z.literal(russianLocale.name),
	code: z.literal(russianLocale.code),
	flag: z.literal(russianLocale.flag)
});

export const localeSchema = z.discriminatedUnion('code', [
	englishLocaleSchema,
	ukrainianLocaleSchema,
	russianLocaleSchema
]);

export type Locale = z.infer<typeof localeSchema>;
export type LocaleName = Locale['name'];
export type LocaleCode = Locale['code'];
