import { DEFAULT_LOCALE, type LocaleCode, LOCALES } from './locale.schema';

export function getLocale(code: LocaleCode) {
	return LOCALES.find((locale) => locale.code === code) ?? DEFAULT_LOCALE;
}

export function getLocaleFromUrl(url: URL) {
	const localeCode = (url.searchParams.get('locale') as LocaleCode) ?? DEFAULT_LOCALE.code;
	return getLocale(localeCode);
}
