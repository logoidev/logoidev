import { json } from '@sveltejs/kit';

import { LocationModel, createLocation, findAllLocations } from 'src/db/entity/location';

export const GET = async ({ params: { id: coinId } }) => {
	const locations = await findAllLocations();

	const related = locations.filter((l) => l.coinId === coinId);

	return json(related);
};

export const POST = async ({ request, params: { id: coinId } }) => {
	const body: LocationModel = await request.json();
	const location = await createLocation({
		...body,
		coinId
	});
	return json({ ...location });
};
