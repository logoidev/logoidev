import { json } from '@sveltejs/kit';

import { findCoinById, updateCoinById } from 'src/db/entity/coin';

export const GET = async ({ params: { id: coinId } }) => {
	const coin = await findCoinById(coinId);

	if (!coin) {
		return json(null);
	}

	return json({ ...coin });
};

export const POST = async ({ request, params: { id: coinId } }) => {
	const body = await request.json();
	const updated = await updateCoinById(coinId, body);
	return json({ ...updated });
};
