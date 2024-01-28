import { json } from '@sveltejs/kit';

import { LocationModel, createLocation } from 'src/db/entity/location';
import { findCoinById } from 'src/db/entity/coin';
import { getAdditionalCoinData } from '../helpers.js';

export const POST = async ({ request, params: { id: coinId } }) => {
	const body: LocationModel = await request.json();

	const coin = await findCoinById(coinId);
	if (!coin) {
		return json(null);
	}

	const currentCoinLocation = await createLocation({
		...body,
		type: 'coin-path',
		coin_id: coinId
	});

	const response = getAdditionalCoinData(coin, currentCoinLocation);

	return json(response);
};
