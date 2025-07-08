import { customAlphabet } from 'nanoid';
import type { CoinType } from 'src/db/entity/coin';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const ID_LENGTH = 11;
const COIN_TYPE_LENGTH = 3;
export const LOGOI_ID_LENGTH = COIN_TYPE_LENGTH + 1 + ID_LENGTH;

export const COIN_PREFIXES = {
	BLOG: 'B'
} as const;

const ID_VALIDATION_REGEX = new RegExp(
	`^([A-Z]){${COIN_TYPE_LENGTH}}:([A-Z]|[0-9]){${ID_LENGTH}}$`
);

const nanoid = customAlphabet(alphabet, ID_LENGTH);

export const createId = (type: CoinType) => `${type}:${nanoid()}`;

export const validateId = (id: string) => ID_VALIDATION_REGEX.test(id);
