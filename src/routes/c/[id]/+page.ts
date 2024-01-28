import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { getCoinById } from 'src/utils/db';

export const load = async ({ params: { id: coinId } }) => {
	console.log('Requesting coin', coinId);

	const coin = getCoinById(coinId);

	if (!coin && !browser) {
		redirect(302, '/');
	}

	console.log('Got coin', coin);

	return coin;
};
