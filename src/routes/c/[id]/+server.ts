import { json } from '@sveltejs/kit';

import { CoinModel, findAllCoins, findCoinById, updateCoinById } from 'src/db/entity/coin';
import { getAdditionalCoinData } from './helpers';
import { LocationModel } from 'src/db/entity/location';
import { AppDataSource } from 'src/db/data-source';

export const GET = async ({ params: { id: coinId } }) => {
	const coin = await findCoinById(coinId);

	if (!coin) {
		return json(null);
	}

	const lastCoinLocations: LocationModel = await AppDataSource.manager.find(LocationModel, {
		where: { type: 'coin-path', coin_id: coinId }
	});
	const lastCoinLocationsSorted = lastCoinLocations.sort(
		(a: LocationModel, b: LocationModel) => a.timestamp - b.timestamp
	);

	const lastCoinLocation = lastCoinLocationsSorted.pop();
	const response = await getAdditionalCoinData(coin, lastCoinLocation);

	return json(response);
};

export const POST = async ({ request, params: { id: coinId } }) => {
	const body = await request.json();
	const updated = await updateCoinById(coinId, body);
	if (!updated) {
		return json(null);
	}

	return json({ ...updated });
};
