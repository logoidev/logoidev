import { json } from '@sveltejs/kit';

import { LocationModel, createLocation } from 'src/db/entity/location';
import { findCoinById, updateCoinById } from 'src/db/entity/coin';
import { getAdditionalCoinData, getNextCoinDestination } from '../helpers.js';
import { log } from 'src/utils/log.js';

export const POST = async ({ request, params: { id: coinId } }) => {
	const body: LocationModel = await request.json();

	let coin = await findCoinById(coinId);
	if (!coin) {
		log(`[log response - /c/${coinId}/locations] - not found`);
		return json(null);
	}

	const currentCoinLocation = await createLocation({
		...body,
		type: 'coin-path',
		coin_id: coinId
	});

	const { reached, response } = await getAdditionalCoinData(coin, currentCoinLocation);

	if (reached) {
		const updated = await updateCoinById(coin.id, {
			step_index: coin.step_index + 1,
			next_location_id: undefined,
			balance: coin?.balance ? coin.balance + 1 : 1
		});
		if (!updated) {
			console.log('Coin disappeared after destination reached');
		} else {
			coin = updated;
			response.coin = coin;
		}

		const destination = await getNextCoinDestination(coin);

		if (destination) {
			response.destination = destination;
		} else {
			log(`Could not get next location for ${coin.id}`);
		}
	}

	log(`[log response - /c/${coinId}/locations]`, response);

	return json(response);
};
