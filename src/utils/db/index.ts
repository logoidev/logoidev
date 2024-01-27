import { createId } from 'src/utils/id';

import { getCoinByIdShared, createCoinShared, defaultCoinProperties } from './base';
import type { CoinMap } from 'src/routes/c/[id]/types';

const IN_MEMORY: CoinMap = {};

export const getCoinById = (id: string) => getCoinByIdShared(id, IN_MEMORY);

export const createCoin = (
	coinId = createId(),
	overwrite?: Partial<typeof defaultCoinProperties>
) => createCoinShared(coinId, IN_MEMORY, overwrite);
