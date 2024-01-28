import { AppDataSource } from './data-source';

let isInitialised = false;

export const initialiseDb = async () => {
	if (!isInitialised) {
		await AppDataSource.initialize();
		isInitialised = true;
	}
};

initialiseDb().catch((error) => console.log(error));