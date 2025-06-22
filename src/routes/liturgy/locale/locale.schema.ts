import { z } from 'zod';

const ukrainianLocale = {
	name: 'Ukrainian',
	code: 'uk'
} as const;

const englishLocale = {
	name: 'English',
	code: 'en'
} as const;

const ukrainianLocaleSchema = z.object({
	name: z.literal(ukrainianLocale.name),
	code: z.literal(ukrainianLocale.code)
});

const englishLocaleSchema = z.object({
	name: z.literal(englishLocale.name),
	code: z.literal(englishLocale.code)
});

export const localeSchema = z.discriminatedUnion('code', [
	ukrainianLocaleSchema,
	englishLocaleSchema
]);

export type Locale = z.infer<typeof localeSchema>;
export type LocaleName = Locale['name'];
export type LocaleCode = Locale['code'];
