export type CoinType = 'LGI';

export type Coin = {
	type: CoinType;
	id: string;
	amount: number;
	color: 'white' | 'black';
	version: number;
	issuedFor: 'v';
};

export type CoinMap = Record<string, Coin>;
