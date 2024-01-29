import { json } from '@sveltejs/kit';
import { CoinModel, createCoin } from 'src/db/entity/coin';
import { LocationModel, createLocation } from 'src/db/entity/location';
import { createId } from 'src/utils/id';

const locations: Array<LocationModel> = [
	{
		latitude: 42.35828799608816,
		longitude: -71.09420396931398,
		balance: 100,
		name: 'MIT Chapel',
		accuracy: 0,
		is_first: true,
		id: 0,
		timestamp: 0,
		type: 'christian',
		coin_id: '',
		step_index: 0
	},
	{
		latitude: 42.366907740875504,
		longitude: -71.10513514102031,
		id: 1,
		balance: 0,
		is_first: false,
		step_index: 1,
		coin_id: '',
		name: 'St. Mary Orthodox Church',
		accuracy: 0,
		timestamp: 0,
		type: 'christian'
	}
];

const createLocationsForCoin = async (coin_id: string) =>
	Promise.all(
		locations.map((location) => {
			return createLocation({
				...location,
				coin_id
			});
		})
	);

export const GET = async () => {
	const coinData: CoinModel = {
		id: createId('LGI'),
		color: 'white',
		step_index: 0
	};

	try {
		const coin = await createCoin(coinData);
		await createLocationsForCoin(coin.id);
		return json({ ...coin });
	} catch (error) {
		return json({ ...coinData });
	}
};
