import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class CoinModel {
	@PrimaryColumn('varchar')
	id: string;

	@Column('int', { default: '0', nullable: false })
	balance?: number;

	@Column('varchar', { default: 'LGI' })
	type?: 'LGI';

	@Column('varchar', { default: 'white' })
	color?: 'white' | 'black';

	@Column('int', { default: 1 })
	version?: number;

	@Column('int', { default: 0, nullable: false })
	step_index: number;

	@Column('int', { default: null, nullable: true })
	next_location_id?: number;
}

export type CoinType = CoinModel['type'];
