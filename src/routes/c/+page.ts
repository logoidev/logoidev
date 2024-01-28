import { redirect } from '@sveltejs/kit';
import { createCoin, type Coin, type CoinType } from 'src/../db/src/entity/coin';
import { createId } from 'src/utils/id';

const defaultCoinProperties: Omit<Coin, 'id'> = {
	type: 'LGI',
	amount: 0,
	color: 'white',
	version: 1,
	createdFor: 'v'
};

const createCoinData = (
	type: CoinType = 'LGI',
	overwrite?: Partial<typeof defaultCoinProperties>
): Coin => ({
	id: createId(type),
	...defaultCoinProperties,
	...overwrite
});

export const load = async () => {
	const coinData = createCoinData();
	const coin = await createCoin(coinData);
	redirect(302, `/c/${coin.id}`);
};
