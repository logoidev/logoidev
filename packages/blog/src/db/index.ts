import { AppDataSource } from './data-source';

export let isInitialised = false;
export let isDbUnavailable = true;

export const initialiseDb = async () => {
	if (!isInitialised && !AppDataSource.manager.connection.isInitialized) {
		await AppDataSource.initialize();
		isInitialised = true;
		isDbUnavailable = false;
	}
};

initialiseDb().catch((error) => {
	console.log(error);
	isDbUnavailable = true;
});
