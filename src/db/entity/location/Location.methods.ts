import { initialiseDb } from '../..';
import { AppDataSource } from '../../data-source';
import { LocationModel } from './Locaiton.model';

export const createLocation = async (locationModel: LocationModel) => {
	await initialiseDb();

	const location = new LocationModel();
	location.id = locationModel.id;
	location.coinId = locationModel.coinId;
	location.stage = locationModel.stage;
	location.accuracy = locationModel.accuracy;
	location.latitude = locationModel.latitude;
	location.longitude = locationModel.latitude;
	location.timestamp = locationModel.timestamp;
	console.log('Saving', location);
	await AppDataSource.manager.save(location);
	return location;
};

export const findAllLocations = async () => {
	await initialiseDb();
	const locations = await AppDataSource.manager.find(LocationModel);
	return locations;
};

export const findLocationsByCoinId = async (coinId: string) => {
	const locations = await findAllLocations();
	return locations.find((l) => l.coinId === coinId);
};

export const findLocationById = async (id: string) => {
	return AppDataSource.manager.findOne(LocationModel, { where: { id } });
};

export const updateLocationById = async (id: string, data: Partial<LocationModel>) => {
	await initialiseDb();
	const location = await findLocationById(id);
	for (const key of Object.keys(data)) {
		if (key !== 'id') {
			location[key] = data[key];
		}
	}
	await AppDataSource.manager.save(LocationModel);
	return location;
};
