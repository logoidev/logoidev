import type { Coin, CoinMap } from 'src/routes/c/[id]/types';
import { createId, validateId } from 'src/utils/id';

export type StorageType = 'in-memory' | 'local';

export const defaultCoinProperties: Omit<Coin, 'id'> = {
	type: 'LGI',
	amount: 0,
	color: 'white'
};

export const getCoinByIdShared = (id: string, storage: CoinMap): Coin | null => {
	if (!validateId(id)) {
		return null;
	}
	return storage?.[id] ?? null;
};

export const createCoinShared = (
	coinId = createId(),
	storage: CoinMap,
	overwrite?: Partial<typeof defaultCoinProperties>
) => {
	if (storage?.[coinId]) {
		console.error(`Collision for id: ${coinId}`);
		return null;
	}

	const coin = {
		id: coinId,
		...defaultCoinProperties,
		...overwrite
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
