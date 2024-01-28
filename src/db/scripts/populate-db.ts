import { createLocation } from '../entity/location';

let id = 0;

export const populateDb = async () => {
	console.log('Populating the DB');
	await createLocation({
		latitude: 42.35828799608816,
		longitude: -71.09420396931398,
		id: id++,
		balance: 100,
		initial: 1,
		name: 'MIT Chapel',
		accuracy: 0,
		timestamp: 0,
		type: 'christian'
	});

	await createLocation({
		latitude: 42.366907740875504,
		longitude: -71.10513514102031,
		id: id++,
		balance: 0,
		initial: 0,
		name: 'St. Mary Orthodox Church',
		accuracy: 0,
		timestamp: 0,
		type: 'christian'
	});

	// AppDataSource.manager.connection.close();
};
