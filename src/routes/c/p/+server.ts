import { redirect } from '@sveltejs/kit';
import { CoinModel, createCoin } from 'src/db/entity/coin';
import { createId } from 'src/utils/id';
import { createLocationsForCoin } from '../locations';
import { log } from 'src/utils/log';

export const GET = async () => {
	const coinId = createId('LGI');
	const coinData: CoinModel = {
		id: coinId,
		step_index: 0
	};

	let isError = false;

	try {
		const coin = await createCoin(coinData);
		await createLocationsForCoin(coin.id);
		log('[log response - /c/p]', coin);
	} catch (error) {
		isError = true;
		log('[log response - /c/p db fallback]', coinId);
		redirect(302, `/`);
	}

	const path = isError ? '/' : `/c/${coinData.id}/p`;
	redirect(302, path);
};
