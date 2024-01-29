import 'reflect-metadata';
// import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { DataSource } from 'typeorm';
import { CoinModel } from './entity/coin/Coin.model';
import { LocationModel } from './entity/location/Location.model';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export const AppDataSource = new DataSource({
	type: 'postgres',
	url: 'postgres://default:Bz6fdX0RLaVs@ep-curly-shape-a4wvs6o6-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require',

	// username: 'postgres',
	// password: 'Theeb6uu',
	// database: 'typeormdemo',
	synchronize: true,
	logging: false,
	entities: [CoinModel, LocationModel],
	migrations: [],
	subscribers: []
});
