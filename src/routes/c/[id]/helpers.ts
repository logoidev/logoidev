import { AppDataSource } from 'src/db/data-source';
import { updateCoinById, type CoinModel } from 'src/db/entity/coin';
import { LocationModel, findLocationById } from 'src/db/entity/location';
import { getDistanceBetweenLocations } from 'src/db/entity/location/Location.utils';
import { DISABLE_DISTANCE_CHECK, DISTANCE_LIMIT_M } from 'src/shared/constants';
import { getRandomIntInRange } from 'src/utils/math';

export const getNextCoinDestination = async (coin: CoinModel) => {
	if (!coin.next_location_id) {
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
			.filter((l) => (coin.step_index === 1 ? l.is_first : !l.is_first));

		const index = getRandomIntInRange(0, destinations.length - 1);
		const randomLocation = destinations[index];

		if (randomLocation) {
			await updateCoinById(coin.id, { next_location_id: randomLocation.id });
			return randomLocation;
		} else {
			return null;
		}
	}
	{
		const savedDestination = await findLocationById(coin.next_location_id);
		return savedDestination;
	}
};

export const getAdditionalCoinData = async (coin: CoinModel, lastCoinLocation?: LocationModel) => {
	const destination = await getNextCoinDestination(coin);

	let distance = 0;
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

	return { reached, response: { coin, destination, distance, error } };
};
