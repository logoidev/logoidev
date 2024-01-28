import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LocationModel {
	@PrimaryGeneratedColumn()
	id: string;

	@Column('varchar')
	coinId: string;

	@Column('float')
	accuracy: number;

	@Column('float')
	latitude: number;

	@Column('float')
	longitude: number;

	@Column('float')
	timestamp: number;

	@Column('varchar')
	stage: 'initial' | 'out-of-bounds' | 'payed';
}
