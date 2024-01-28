import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class CoinModel {
	@PrimaryColumn('varchar')
	id: string;

	@Column('int')
	amount: number;

	@Column('varchar')
	type: 'LGI';

	@Column('varchar')
	color: 'white' | 'black';

	@Column('int')
	version: number;

	@Column('varchar')
	createdFor: 'v';
}

export type CoinType = CoinModel['type'];
