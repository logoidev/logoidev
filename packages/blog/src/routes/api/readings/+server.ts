import { json } from '@sveltejs/kit';
import { getLocaleFromUrl } from 'src/routes/liturgy/locale/locale';
import { getTodaysReadings } from 'src/routes/api/readings/readings.server';

export async function GET({ url }: { url: URL }) {
	try {
		const locale = getLocaleFromUrl(url);
		const readings = await getTodaysReadings(locale);

		if (!readings) {
			return json({ error: 'No readings found for this locale' }, { status: 404 });
		}

		return json(readings);
	} catch (error) {
		console.error('Error getting readings:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
