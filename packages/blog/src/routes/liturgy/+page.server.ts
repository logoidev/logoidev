import { getLiturgyData } from './liturgy/liturgy.server';
import { getLocaleFromUrl } from './locale/locale';
import { getSpeakers } from './speaker/speaker';
import { isAdminFromUrl } from './utils/admin';

export const load = async ({ url }) => {
	const locale = getLocaleFromUrl(url);

	const liturgy = await getLiturgyData(locale);
	const speakers = await getSpeakers(locale.code);

	// Check if admin code is present in URL using utility function
	const isAdmin = isAdminFromUrl(url);

	return {
		liturgy,
		locale,
		speakers,
		isAdmin
	};
};
