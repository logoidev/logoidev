import { getLiturgy } from './liturgy/liturgy';
import { getLocaleFromUrl } from './locale/locale';
import { getSpeakers } from './speaker/speaker';
import { env } from '$env/dynamic/private';

export const load = async ({ url }: { url: URL }) => {
	const locale = getLocaleFromUrl(url);

	const liturgy = await getLiturgy(locale);
	const speakers = await getSpeakers(locale.code);

	// Check if admin code is present in URL
	const isAdmin = url.searchParams.get('code') === env.SECRET_ADMIN_CODE;

	return {
		liturgy,
		locale,
		speakers,
		isAdmin
	};
};
