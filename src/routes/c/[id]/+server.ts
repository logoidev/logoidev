import { json } from '@sveltejs/kit';

import { findCoinById, updateCoinById } from 'src/db/entity/coin';
import { getAdditionalCoinData } from './helpers';
import { LocationModel } from 'src/db/entity/location';
import { AppDataSource } from 'src/db/data-source';
import { log } from 'src/utils/log';

const getLastCoinLocation = async (coinId: string) => {
	const lastCoinLocations = await AppDataSource.manager.find(LocationModel, {
		where: { type: 'coin-path', coin_id: coinId }
	});
	const lastCoinLocationsSorted = lastCoinLocations.sort(
		(a: LocationModel, b: LocationModel) => a.timestamp - b.timestamp
	);

	return lastCoinLocationsSorted[lastCoinLocationsSorted.length - 1];
};

export const GET = async ({ params: { id: coinId } }) => {
	const coin = await findCoinById(coinId);

	if (!coin) {
		log(`[log response - /c/${coinId}] - not found`);
		return json(null);
	}

	const lastCoinLocation = await getLastCoinLocation(coin.id);
	const { response } = await getAdditionalCoinData(coin, lastCoinLocation);

	log(`[log response - /c/${coinId}]`, response);

	return json({ ...response });
};

export const POST = async ({ request, params: { id: coinId } }) => {
	const body = await request.json();
	const updated = await updateCoinById(coinId, body);
	if (!updated) {
		return json(null);
	}

	return json({ ...updated });
};
