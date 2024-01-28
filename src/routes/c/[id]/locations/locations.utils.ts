import { LocationModel, findLocationByCoinId } from 'src/db/entity/location';
import { CoinModel } from 'src/db/entity/coin';
import { getDistance } from 'src/db/entity/location/Location.utils';

type CoinExtended = CoinModel & {
	initial_location: LocationModel;
	final_location: LocationModel;
	users_location: LocationModel | null;
	next_destination: LocationModel | null;
	distance_meters: number;
	be_closer?: boolean;
	redeemed?: boolean;
};

export const enhanceCoinWithLocationData = async (
	c: CoinModel,
	skip_fetch = false
): Promise<CoinExtended> => {
	const coin = c as CoinExtended;

	if (!skip_fetch) {
		coin.initial_location = (await findLocationByCoinId(coin.initial_location_id))!;
		coin.final_location = (await findLocationByCoinId(coin.final_location_id))!;
	}

	switch (coin.stage) {
		case undefined:
		case 'initial':
			coin.next_destination = coin.initial_location;
			break;
		case 'en-route':
			coin.next_destination = coin.final_location;
			break;
		case 'final':
			coin.next_destination = null;
			break;
		default:
			console.log('DEFA', coin.stage);
			break;
	}

	if (coin.user_location_id) {
		coin.users_location = (await findLocationByCoinId(coin.user_location_id))!;

		const locationToCoordinate = (l: LocationModel) => ({ lat: l.latitude, lng: l.longitude });

		const p1 = locationToCoordinate(coin.users_location);
		const p2 = locationToCoordinate(coin.next_destination!);

		coin.distance_meters = Math.floor(getDistance(p1, p2) * 1.3);

		// TODO: Remove this
		coin.distance_meters = 9;

		coin.redeemed = !coin.next_destination && coin.distance_meters <= 10;
	}

	return coin;
};
