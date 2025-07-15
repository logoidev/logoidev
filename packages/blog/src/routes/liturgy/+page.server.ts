import { getLiturgyData } from './liturgy/liturgy.server';
import { getLocaleFromUrl } from './locale/locale';
import { getSpeakers } from './speaker/speaker';
import { isAdminFromUrl } from './utils/admin';

export const load = async ({ url }) => {
	// Check if admin code is present in URL using utility function
	const isAdmin = isAdminFromUrl(url);
	const locale = getLocaleFromUrl(url);

	try {
		const liturgy = await getLiturgyData(locale);
		const speakers = await getSpeakers(locale.code);

		return {
			liturgy,
			locale,
			speakers,
			isAdmin,
			error: null
		};
	} catch (error: unknown) {
		console.error('Error getting liturgy:', error);
		return {
			locale,
			error: error instanceof Error ? error.message : 'Unknown error',
			isAdmin: false
		};
	}
};
