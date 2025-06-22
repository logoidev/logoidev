import { getLiturgy } from './liturgy/liturgy';
import { getLocaleFromUrl } from './locale/locale';
import { getSpeakers } from './speaker/speaker';

export const load = async ({ url }: { url: URL }) => {
	const locale = getLocaleFromUrl(url);

	const liturgy = await getLiturgy(locale);
	const speakers = await getSpeakers(locale.code);

	return {
		liturgy,
		locale,
		speakers
	};
};
