import { DEFAULT_LOCALE_CODE, LOCALES } from './locale.constants';
import type { Locale, LocaleCode } from './locale.schema';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let locales: Locale[] | null = null;

export function getCachedLocales(): Locale[] {
	if (locales) {
		return locales;
	}

	locales = LOCALES;
	return locales;
}

async function getLocalesFromServer(): Promise<Locale[]> {
	const response = await fetch('/data/locales.json');
	const data = await response.json();
	return data;
}

async function getLocales(): Promise<Locale[]> {
	const cachedLocales = getCachedLocales();
	if (cachedLocales.length > 0) {
		return cachedLocales;
	}

	const locales = await getLocalesFromServer();

	return locales;
}

async function getDefaultLocale() {
	const locales = await getLocales();
	const defaultLocale = locales.find((locale) => locale.code === DEFAULT_LOCALE_CODE)!;
	return defaultLocale;
}

export async function getLocale(code: LocaleCode): Promise<Locale> {
	const locales = await getLocales();
	const defaultLocale = await getDefaultLocale();
	return locales.find((locale) => locale.code === code) ?? defaultLocale;
}

export async function getLocaleFromUrl(url: URL) {
	const localeCode = (url.searchParams.get('locale') as LocaleCode) || DEFAULT_LOCALE_CODE;
	return localeCode;
}
