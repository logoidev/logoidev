import { AppDataSource } from 'src/db/data-source';
import { updateCoinById, type CoinModel } from 'src/db/entity/coin';
import { LocationModel, findLocationById } from 'src/db/entity/location';
import { getDistanceBetweenLocations } from 'src/db/entity/location/Location.utils';
import { getRandomIntInRange } from 'src/utils/math';

export const getNextCoinDestination = async (coin: CoinModel, gps = false) => {
	if (!coin.next_location_id && gps) {
		const all = await AppDataSource.manager.find(LocationModel, {
			where: {
				coin_id: coin.id,
				step_index: coin.step_index,
				type: coin.color === 'white' ? 'christian' : 'secular'
			}
		});

		const destination = all.filter((a) => a.type !== 'coin-path');
		const index = getRandomIntInRange(0, destination.length - 1);
		const randomLocation = destination[index];

		await updateCoinById(coin.id, { next_location_id: randomLocation.id });

		return randomLocation;
	} else if (coin.next_location_id) {
		const savedDestination = await findLocationById(coin.next_location_id);
		return savedDestination;
	} else {
		console.log('Could not find the next location');
		return null;
	}
};

export const getAdditionalCoinData = async (
	coin: CoinModel,
	lastCoinLocation?: LocationModel,
	{ gps = false } = {}
) => {
	const destination = await getNextCoinDestination(coin, gps);

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

	return { coin: { ...coin }, destination: { ...destination }, distance, redeemed, error };
};
