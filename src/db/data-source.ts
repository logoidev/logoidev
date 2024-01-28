import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CoinModel } from './entity/coin/Coin.model';
import { LocationModel } from './entity/location/Locaiton.model';

export const AppDataSource = new DataSource({
	type: 'sqlite',
	database: 'database.sqlite',
	synchronize: true,
	logging: false,
	entities: [CoinModel, LocationModel],
	migrations: [],
	subscribers: []
});
