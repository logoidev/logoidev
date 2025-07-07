import { redirect } from '@sveltejs/kit';
import { CoinModel, createCoin } from 'src/db/entity/coin';
import { createId } from 'src/utils/id';
import { createLocationsForCoin } from '../locations';

import { log } from 'src/utils/log';
import { trackEvent } from 'src/lib/analytics/posthog';

export const GET = async () => {
	const coinData: CoinModel = {
		id: createId('LGI'),
		color: 'black',
		step_index: 0
	};

	try {
		const coin = await createCoin(coinData);
		await createLocationsForCoin(coin.id);
		log('[log response - /c/b', coin);
		// TODO: set up server events properly
		trackEvent('black_coin_requested');
	} catch (error) {
		log('[log response - /c/b fallback]');
		console.error(error);
	}

	redirect(302, `/c/${coinData.id}`);
};
