import { json } from '@sveltejs/kit';

import { findCoinById, updateCoinById } from 'src/db/entity/coin';
import { enhanceCoinWithLocationData } from './locations/locations.utils.js';

export const GET = async ({ params: { id: coinId } }) => {
	const coin = await findCoinById(coinId);

	if (!coin) {
		return json(null);
	}

	const coinExtended = await enhanceCoinWithLocationData(coin);

	return json({ ...coinExtended });
};

export const POST = async ({ request, params: { id: coinId } }) => {
	const body = await request.json();
	const updated = await updateCoinById(coinId, body);
	if (!updated) {
		return json(null);
	}
	const coinExtended = await enhanceCoinWithLocationData(updated);
	return json({ ...coinExtended });
};
