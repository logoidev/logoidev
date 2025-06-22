import { getLiturgy } from './liturgy/liturgy';
import { getLocale, getLocaleFromUrl } from './locale/locale';

export const load = async ({ url }: { url: URL }) => {
	const localeCode = await getLocaleFromUrl(url);
	const locale = await getLocale(localeCode);

	// Validate the liturgy data against the schema
	const liturgy = await getLiturgy(locale);

	return {
		liturgy,
		locale
	};
};
