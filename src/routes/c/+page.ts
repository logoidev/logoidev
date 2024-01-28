import { redirect } from '@sveltejs/kit';
import { createCoin } from 'src/utils/db';

export const csr = false;

export const load = async () => {
	const coin = createCoin()!;
	console.log('Created coin', coin.id);
	redirect(302, `/c/${coin.id}`);
};
