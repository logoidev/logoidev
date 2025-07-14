import { z } from 'zod';

type GenericLocale = {
	name: string;
	localName: string;
	code: string;
	flag: string;
};

const englishLocale = {
	name: 'English',
	localName: 'English',
	code: 'en',
	flag: '🇺🇸'
} as const satisfies GenericLocale;

const ukrainianLocale = {
	name: 'Ukrainian',
	localName: 'Українська',
	code: 'uk',
	flag: '🇺🇦'
} as const satisfies GenericLocale;

const russianLocale = {
	name: 'Russian',
	localName: 'Русский',
	code: 'ru',
	flag: '🇷🇺'
} as const satisfies GenericLocale;

const churchSlavonicLocale = {
	name: 'Church Slavonic',
	localName: 'Церковнославянский',
	code: 'cu',
	flag: '📜'
} as const satisfies GenericLocale;

const greekLocale = {
	name: 'Greek',
	localName: 'Ελληνική',
	code: 'gr',
	flag: '🇬🇷'
} as const satisfies GenericLocale;

export const DEFAULT_LOCALE = englishLocale;

export const LOCALES = [
	englishLocale,
	ukrainianLocale,
	russianLocale,
	churchSlavonicLocale,
	greekLocale
] as const;

export const LOCALES_CODES = LOCALES.map((locale) => locale.code);

export const localeSchema = z.discriminatedUnion('code', [
	toLanguageLocaleSchema(englishLocale),
	toLanguageLocaleSchema(ukrainianLocale),
	toLanguageLocaleSchema(russianLocale),
	toLanguageLocaleSchema(churchSlavonicLocale),
	toLanguageLocaleSchema(greekLocale)
]);

export type Locale = (typeof LOCALES)[number];
export type LocaleName = Locale['name'];
export type LocaleCode = Locale['code'];

function toLanguageLocaleSchema<T extends GenericLocale>(
	locale: T
): z.ZodObject<{
	name: z.ZodLiteral<T['name']>;
	localName: z.ZodLiteral<T['localName']>;
	code: z.ZodLiteral<T['code']>;
	flag: z.ZodLiteral<T['flag']>;
}> {
	return z.object({
		name: z.literal(locale.name),
		localName: z.literal(locale.localName),
		code: z.literal(locale.code),
		flag: z.literal(locale.flag)
	});
}
