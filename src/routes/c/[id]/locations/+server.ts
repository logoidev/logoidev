import { json } from '@sveltejs/kit';

import { LocationModel, createLocation } from 'src/db/entity/location';
import { updateCoinById } from 'src/db/entity/coin';
import { enhanceCoinWithLocationData } from './locations.utils.js';

export const POST = async ({ request, params: { id: coinId } }) => {
	const { here, ...body }: LocationModel & { here?: boolean } = await request.json();

	body.type = 'user-path';
	const userLocation = await createLocation(body);

	const coin = await updateCoinById(coinId, {
		user_location_id: userLocation.id,
		stage: 'en-route'
	});

	if (!coin) {
		return json(null);
	}

	const coinExtended = await enhanceCoinWithLocationData(coin);

	if (here && coinExtended.distance_meters >= 10) {
		coinExtended.be_closer = true;
	}

	console.log('HERE', coinExtended, here);

	return json({ ...coinExtended });
};
