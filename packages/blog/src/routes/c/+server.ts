import { json } from '@sveltejs/kit';
import { CoinModel, createCoin } from 'src/db/entity/coin';
import { createId } from 'src/utils/id';
import { createLocationsForCoin } from './locations';
import { log } from 'src/utils/log';

export const GET = async () => {
	const coinId = createId('LGI');
	const coinData: CoinModel = {
		id: coinId,
		step_index: 0
	};

	try {
		const coin = await createCoin(coinData);
		await createLocationsForCoin(coin.id);
		log('[log response - /c]', coin);
		return json({ ...coin });
	} catch (error) {
		log('[log response - /c db fallback]', coinId);
		return json(coinData);
	}
};
