import { redirect } from '@sveltejs/kit';
import { createCoin, getCoinById } from 'src/utils/db';
import type { Coin } from './types.js';
import { MANIFEST } from 'src/shared/constants.js';

export const load = async ({ params: { id: coinId } }) => {
	let coin: Coin | null;

	if (coinId === MANIFEST) {
		coin = null;
	} else if (coinId === '$') {
		coin = createCoin();
	} else {
		coin = getCoinById(coinId);
	}

	if (!coin) {
		redirect(302, '/');
	}

	return coin;
};
