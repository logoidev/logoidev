import type { Coin, CoinMap, CoinType } from 'src/routes/c/types';
import { createId, validateId } from 'src/utils/id';

export type StorageType = 'in-memory' | 'local';

export const defaultCoinProperties: Omit<Coin, 'id'> = {
	type: 'LGI',
	amount: 0,
	color: 'white',
	version: 1,
	issued_for: 'v',
	issued_at: null
};

export const getCoinByIdShared = (id: string, storage: CoinMap): Coin | null => {
	if (!validateId(id)) {
		return null;
	}
	return storage?.[id] ?? null;
};

export const createCoinShared = (
	type: CoinType = 'LGI',
	coinId = createId(type),
	storage: CoinMap,
	overwrite?: Partial<typeof defaultCoinProperties>
) => {
	if (storage?.[coinId]) {
		console.error(`Collision for id: ${coinId}`);
		return null;
	}

	const coin: Coin = {
		id: coinId,
		...defaultCoinProperties,
		...overwrite,
		issued_at: new Date()
	};

	if (!validateId(coin.id)) {
		throw new Error('Invalid ID');
	}

	if (storage) {
		storage[coinId] = coin;
	} else {
		console.log('Coin dropped', coin);
	}
	return coin;
};
