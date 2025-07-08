import { initialiseDb } from '../..';
import { AppDataSource } from '../../data-source';
import { CoinModel } from './Coin.model';

export const createCoin = async (coinData: CoinModel) => {
	await initialiseDb();

	const coin = new CoinModel();

	for (const key of Object.keys(coinData)) {
		coin[key] = coinData[key];
	}

	await AppDataSource.manager.save(coin);

	return coin;
};

export const findAllCoins = async () => {
	await initialiseDb();
	const coins = await AppDataSource.manager.find(CoinModel);
	return coins;
};

export const findCoinById = async (id: string) => {
	await initialiseDb();
	const coin = await AppDataSource.manager.findOne(CoinModel, { where: { id } });
	return coin;
};

export const updateCoinById = async (id: string, data: Partial<CoinModel>) => {
	await initialiseDb();
	const coin = await findCoinById(id);
	for (const key of Object.keys(data)) {
		coin[key] = data[key];
	}
	await AppDataSource.manager.save(coin);
	return coin;
};
