import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RedemptionModel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar')
	coinId: string;

	@Column('number')
	location_id: number;

	@Column('varchar')
	direction: 'to_location' | 'from_location';

	@Column('int', { default: 0 })
	amount: number;
}
