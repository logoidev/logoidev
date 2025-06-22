import { type Liturgy, liturgySchema } from './liturgy.schema';
import { DEFAULT_LOCALE } from '../locale/locale.constants';
import type { Locale } from '../locale/locale.schema';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let liturgy: Liturgy | null = null;

export async function getLiturgy(locale: Locale = DEFAULT_LOCALE) {
	if (liturgy) {
		return liturgy;
	}

	const liturgyData = await import(`./data/liturgy.${locale.code}.json`);

	const parsedLiturgy = liturgySchema.safeParse(liturgyData.default);

	if (!parsedLiturgy.success) {
		console.error('Liturgy data validation failed:', parsedLiturgy.error);
		return null;
	}

	liturgy = parsedLiturgy.data;
	return liturgy;
}
