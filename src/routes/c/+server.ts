import { json } from '@sveltejs/kit';
import { AppDataSource } from 'src/db/data-source';
import { CoinModel, createCoin } from 'src/db/entity/coin';
import { LocationModel } from 'src/db/entity/location';
import { createId } from 'src/utils/id';
import { getRandomIntInRange } from 'src/utils/math';
import { enhanceCoinWithLocationData } from './[id]/locations/locations.utils';

export const GET = async () => {
	const color = 'white';
	const type = color === 'white' ? 'christian' : 'secular';
	const initialLocations = await AppDataSource.manager.find(LocationModel, {
		where: { type, initial: 1 }
	});
	const initialRandomIndex = getRandomIntInRange(0, initialLocations.length - 1);
	const initialLocation = initialLocations[initialRandomIndex];

	const finalLocations = await AppDataSource.manager.find(LocationModel, {
		where: { type, initial: 0 }
	});

	const finalRandomIndex = getRandomIntInRange(0, finalLocations.length - 1);
	const finalLocation = finalLocations[finalRandomIndex];

	const coinData: CoinModel = {
		id: createId('LGI'),
		initial_location_id: initialLocation.id,
		user_location_id: 0,
		final_location_id: finalLocation.id
	};

	const coin = await createCoin(coinData);

	coinData.initial_location = initialLocation;
	coinData.final_locaiton = finalLocation;

	const coinExtended = await enhanceCoinWithLocationData(coin, true);

	return json({ ...coinExtended });
};
