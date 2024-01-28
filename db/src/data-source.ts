import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Coin } from './entity/coin/Coin.model';

export const AppDataSource = new DataSource({
	type: 'sqlite',
	database: 'database.sqlite',
	synchronize: true,
	logging: false,
	entities: [Coin],
	migrations: [],
	subscribers: []
});
