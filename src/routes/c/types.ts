export type CoinType = 'LGI';

export type Coin = {
	type: CoinType;
	id: string;
	amount: number;
	color: 'white' | 'black';
	version: number;
	issued_for: 'v';
	issued_at: null | Date;
};

export type CoinMap = Record<string, Coin>;
