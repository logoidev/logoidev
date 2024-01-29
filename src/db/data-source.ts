import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CoinModel } from './entity/coin/Coin.model';
import { LocationModel } from './entity/location/Location.model';

export const AppDataSource = new DataSource({
	type: 'postgres',
	url: process.env.POSTGRES_URL,
	synchronize: true,
	logging: false,
	entities: [CoinModel, LocationModel],
	migrations: [],
	subscribers: []
});
