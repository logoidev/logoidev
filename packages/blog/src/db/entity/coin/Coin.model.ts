import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class CoinModel {
	@PrimaryColumn('varchar')
	id: string;

	@Column('int', { default: '0', nullable: false })
	balance?: number;

	@Column('varchar', { default: 'LGI' })
	type?: 'LGI' | 'LGU';

	@Column('varchar', { default: 'white' })
	color?: 'white' | 'black';

	@Column('int', { default: 1 })
	version?: number;

	@Column('int', { default: 0, nullable: false })
	step_index: number;

	@Column('int', { default: null, nullable: true })
	next_location_id?: number;

	@Column('varchar', { nullable: true, default: undefined })
	claim_receipt_url?: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
	created_at?: Date;

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)'
	})
	updated_at?: Date;
}

export type CoinType = CoinModel['type'];
