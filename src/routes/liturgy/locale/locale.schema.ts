import { z } from 'zod';

const ukrainianLocale = {
	name: 'Ukrainian',
	localName: 'Українська',
	code: 'uk',
	flag: '🇺🇦'
} as const;

const englishLocale = {
	name: 'English',
	localName: 'English',
	code: 'en',
	flag: '🇺🇸'
} as const;

export const LOCALES = [ukrainianLocale, englishLocale] as const;

export const DEFAULT_LOCALE = englishLocale;

const ukrainianLocaleSchema = z.object({
	name: z.literal(ukrainianLocale.name),
	code: z.literal(ukrainianLocale.code),
	flag: z.literal(ukrainianLocale.flag)
});

const englishLocaleSchema = z.object({
	name: z.literal(englishLocale.name),
	code: z.literal(englishLocale.code),
	flag: z.literal(englishLocale.flag)
});

export const localeSchema = z.discriminatedUnion('code', [
	ukrainianLocaleSchema,
	englishLocaleSchema
]);

export type Locale = z.infer<typeof localeSchema>;
export type LocaleName = Locale['name'];
export type LocaleCode = Locale['code'];
