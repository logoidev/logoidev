import { json } from '@sveltejs/kit';

import { LocationModel, createLocation } from 'src/db/entity/location';
import { findCoinById, updateCoinById } from 'src/db/entity/coin';
import { getAdditionalCoinData } from '../helpers.js';

export const POST = async ({ request, params: { id: coinId } }) => {
	const body: LocationModel = await request.json();

	const coin = await findCoinById(coinId);
	if (!coin) {
		console.log(`[log response - /c/${coinId}/locations] - not found`);
		return json(null);
	}

	const currentCoinLocation = await createLocation({
		...body,
		type: 'coin-path',
		coin_id: coinId
	});

	const response = await getAdditionalCoinData(coin, currentCoinLocation, { gps: true });

	if (response.error !== 'come_closer') {
		response.coin = (await updateCoinById(coin.id, {
			step_index: coin.step_index + 1
		}))!;
	}

	console.log(`[log response - /c/${coinId}/locations]`, response);

	return json(response);
};
