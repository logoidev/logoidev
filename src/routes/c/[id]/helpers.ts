import { AppDataSource } from 'src/db/data-source';
import { updateCoinById, type CoinModel } from 'src/db/entity/coin';
import { LocationModel } from 'src/db/entity/location';
import { getDistanceBetweenLocations } from 'src/db/entity/location/Location.utils';

export const getNextCoinDestination = async (coin: CoinModel) => {
	const all = await AppDataSource.manager.find(LocationModel, {
		where: {
			coin_id: coin.id,
			step_index: coin.step_index
		}
	});
	const destination = all.filter((a) => a.type !== 'coin-path');

	return destination[0];
};

export const getAdditionalCoinData = async (coin: CoinModel, lastCoinLocation: LocationModel) => {
	const destination = await getNextCoinDestination(coin);

	let distance = -1;
	if (destination && lastCoinLocation) {
		distance = getDistanceBetweenLocations(lastCoinLocation, destination);
	}

	let error: '' | 'come_closer' = '';
	const redeemed = false;

	// TOOD: Remove
	// distance = 15;

	if (distance >= 20) {
		error = 'come_closer';
	}

	return { destination, distance, coin, redeemed, error };
};
