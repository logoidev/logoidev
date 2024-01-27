type CoinType = 'LGI';

export type Coin = {
	type: CoinType;
	id: string;
	amount: number;
	color: 'white' | 'black';
};

export type CoinMap = Record<string, Coin>;
