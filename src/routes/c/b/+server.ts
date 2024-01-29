import { redirect } from '@sveltejs/kit';
import { CoinModel, createCoin } from 'src/db/entity/coin';
import { createId } from 'src/utils/id';
import { createLocationsForCoin } from '../locations';
import { trackAnalyticsEvent } from 'src/components/AnalyticsScripts.svelte';
import { log } from 'src/utils/log';

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
		trackAnalyticsEvent('Black coin requested');
	} catch (error) {
		log('[log response - /c/b fallback]');
		console.error(error);
	}

	redirect(302, `/c/${coinData.id}`);
};
