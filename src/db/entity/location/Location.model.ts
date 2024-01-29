import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LocationModel {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column('varchar', { nullable: true, default: null })
	name: string;

	@Column('varchar', { nullable: true, default: null })
	coin_id: string;

	@Column('varchar', { nullable: true, default: null })
	type: 'christian' | 'secular' | 'coin-path';

	@Column('bool', { nullable: false })
	is_first: boolean;

	@Column('int', { default: 0, nullable: false })
	step_index: number;

	@Column('float')
	latitude: number;

	@Column('float')
	longitude: number;

	@Column('float', { default: 0 })
	accuracy: number;

	@Column('float', { nullable: true, default: null })
	timestamp: number;

	@Column('int', { default: 0 })
	balance: number;
}
