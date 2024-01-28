import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class CoinModel {
	@PrimaryColumn('varchar')
	id: string;

	@Column('int')
	initial_location_id: number;

	@Column('int', { nullable: true, default: null })
	user_location_id?: number;

	@Column('int')
	final_location_id: number;

	@Column('int', { default: '0', nullable: false })
	balance?: number;

	@Column('varchar', { default: 'LGI' })
	type?: 'LGI';

	@Column('varchar', { default: 'white' })
	color?: 'white' | 'black';

	@Column('int', { default: 1 })
	version?: number;

	@Column('varchar', { default: 'initial', nullable: false })
	stage?: 'initial' | 'en-route' | 'final';

	@Column('varchar', { default: 'mit-reality-hack' })
	createdFor?: 'v' | 'mit-reality-hack';
}

export type CoinType = CoinModel['type'];
