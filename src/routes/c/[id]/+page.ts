import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

import { findAllCoins } from 'src/../db/src/entity/coin';

export const load = async ({ params: { id: coinId } }) => {
	console.log('Requesting coin', coinId);

	const coins = await findAllCoins();
	const coin = coins.find((c) => c.id === coinId);

	if (!coin && !browser) {
		redirect(302, '/');
	}

	console.log('Got coin', coin);

	return { ...coin };
};
