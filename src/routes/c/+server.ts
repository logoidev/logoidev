import { json } from '@sveltejs/kit';
import { CoinModel, createCoin } from 'src/db/entity/coin';
import { createId } from 'src/utils/id';
import { createLocationsForCoin } from './locations';

export const GET = async () => {
	const coinId = createId('LGI');
	const coinData: CoinModel = {
		id: coinId,
		step_index: 0
	};

	try {
		const coin = await createCoin(coinData);
		await createLocationsForCoin(coin.id);
		console.log('[log response - /c]', coin);
		return json({ ...coin });
	} catch (error) {
		console.log('[log response - /c db fallback]', coinId);
		return json(coinData);
	}
};
