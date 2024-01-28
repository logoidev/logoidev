import { initialiseDb } from '../..';
import { AppDataSource } from '../../data-source';
import { LocationModel } from './Location.model';

export const createLocation = async (locationModel: LocationModel) => {
	await initialiseDb();

	const location = new LocationModel();

	for (const key of Object.keys(locationModel)) {
		if (key !== 'id') {
			location[key] = locationModel[key];
		}
	}

	console.log('Saving', location);
	await AppDataSource.manager.save(location);
	return location;
};

export const findAllLocations = async () => {
	await initialiseDb();
	const locations = await AppDataSource.manager.find(LocationModel);
	return locations;
};

export const findLocationByCoinId = async (id: number) => {
	const location = await AppDataSource.manager.findOne(LocationModel, { where: { id } });
	return location;
};

export const updateLocationById = async (id: number, data: Partial<LocationModel>) => {
	await initialiseDb();
	const location = await AppDataSource.manager.find(LocationModel, { where: { id } });
	for (const key of Object.keys(data)) {
		if (key !== 'id') {
			location[key] = data[key];
		}
	}
	await AppDataSource.manager.save(LocationModel);
	return location;
};
