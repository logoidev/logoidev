import { createLocation, findAllLocations } from '../entity/location';

let id = 1;

export const populateDb = async () => {
	const locations = await findAllLocations();
	if (locations.length) {
		return;
	}

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

	await createLocation({
		latitude: 42.35973557281482,
		longitude: -71.0920763494513,
		id: id++,
		balance: 50,
		initial: 1,
		name: 'Oculus at MIT',
		accuracy: 0,
		timestamp: 0,
		type: 'secular'
	});

	await createLocation({
		latitude: 42.33813685733882,
		longitude: -71.0990584704083,
		id: id++,
		balance: 0,
		initial: 0,
		name: 'Isabella Stewart Gardner Museum',
		accuracy: 0,
		timestamp: 0,
		type: 'secular'
	});

	console.log('Populated database');

	// AppDataSource.manager.connection.close();
};
