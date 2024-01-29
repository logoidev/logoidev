import { AppDataSource } from 'src/db/data-source';
import { updateCoinById, type CoinModel } from 'src/db/entity/coin';
import { LocationModel, findLocationById } from 'src/db/entity/location';
import { getDistanceBetweenLocations } from 'src/db/entity/location/Location.utils';
import { DISABLE_DISTANCE_CHECK, DISTANCE_LIMIT_M } from 'src/shared/constants';
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

		// TODO: Move filtering to the SQL part
		const destinations = all
			.filter((l) => l.type !== 'coin-path')
			.filter((l) => (coin.step_index === 0 ? l.is_first : !l.is_first));

		const index = getRandomIntInRange(0, destinations.length - 1);
		const randomLocation = destinations[index];

		if (randomLocation) {
			await updateCoinById(coin.id, { next_location_id: randomLocation.id });
			return randomLocation;
		} else {
			return null;
		}
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
	let reached = false;

	if (!DISABLE_DISTANCE_CHECK && distance >= DISTANCE_LIMIT_M) {
		error = 'come_closer';
	} else {
		reached = true;
	}

	return { coin, destination, distance, reached, error };
};
