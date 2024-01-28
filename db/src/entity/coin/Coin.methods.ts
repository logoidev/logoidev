import { initialiseDb } from '../..';
import { AppDataSource } from '../../data-source';
import { Coin } from './Coin.model';

export const createCoin = async (coinData: Coin) => {
	await initialiseDb();

	const coin = new Coin();
	coin.id = coinData.id;
	coin.amount = coinData.amount;
	coin.color = coinData.color;
	coin.createdFor = coinData.createdFor;
	coin.type = coinData.type;
	coin.version = coinData.version;
	await AppDataSource.manager.save(coin);
	return coin;
};

export const findAllCoins = async () => {
	await initialiseDb();
	const coins = await AppDataSource.manager.find(Coin);
	return coins;
};
