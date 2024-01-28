import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LocationModel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { nullable: true, default: null })
	name: string;

	@Column('varchar', { nullable: true, default: null })
	type: 'christian' | 'secular' | 'user-path';

	@Column('int', { nullable: true, default: null })
	initial: 0 | 1;

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
