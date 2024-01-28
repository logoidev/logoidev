import { createId } from 'src/utils/id';

import { getCoinByIdShared, createCoinShared, defaultCoinProperties } from './base';
import type { CoinType, CoinMap } from 'src/routes/c/types';

const IN_MEMORY: CoinMap = {};

export const getCoinById = (id: string) => getCoinByIdShared(id, IN_MEMORY);

export const createCoin = (
	type: CoinType = 'LGI',
	coinId = createId(type),
	overwrite?: Partial<typeof defaultCoinProperties>
) => createCoinShared(type, coinId, IN_MEMORY, overwrite);
