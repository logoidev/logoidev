import { AppDataSource } from './data-source';
import { populateDb } from './scripts/populate-db';

let isInitialised = false;

export const initialiseDb = async () => {
	if (!isInitialised && !AppDataSource.manager.connection.isInitialized) {
		await AppDataSource.initialize();
		isInitialised = true;
		await populateDb();
	}
};

initialiseDb().catch((error) => console.log(error));
