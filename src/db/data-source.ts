import 'reflect-metadata';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { DataSource } from 'typeorm';
import { CoinModel } from './entity/coin/Coin.model';
import { LocationModel } from './entity/location/Location.model';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AppDataSource = new DataSource({
	type: 'sqlite',
	database: path.resolve(__dirname, '..', '..', '..', 'database.sqlite'),
	synchronize: true,
	logging: false,
	entities: [CoinModel, LocationModel],
	migrations: [],
	subscribers: []
});
