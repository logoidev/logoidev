import { redirect } from '@sveltejs/kit';
import { CoinModel, createCoin } from 'src/db/entity/coin';
import { createId } from 'src/utils/id';
import { createLocationsForCoin } from '../locations';

export const GET = async () => {
	const coinData: CoinModel = {
		id: createId('LGI'),
		color: 'black',
		step_index: 0
	};

	try {
		const coin = await createCoin(coinData);
		await createLocationsForCoin(coin.id);
		console.log('[log response - /c/b', coin);
	} catch (error) {
		console.log('[log response - /c/b fallback]');
		console.error(error);
	}

	redirect(302, `/c/${coinData.id}`);
};
