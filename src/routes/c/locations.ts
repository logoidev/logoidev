import { createLocation, type LocationModel } from 'src/db/entity/location';

type LocationRequired = Pick<LocationModel, 'name' | 'latitude' | 'longitude'>;

type LocationOptional = Partial<Omit<LocationModel, keyof LocationRequired>>;

type Location = LocationRequired & LocationOptional;

const LOCATION_DEFAULTS: LocationOptional = {
	balance: 0,
	accuracy: 0,
	is_first: false,
	id: 0,
	timestamp: 0,
	type: 'christian',
	coin_id: '',
	step_index: 1
};

const makeLocationWithDefaults = (location: Location) =>
	({
		...LOCATION_DEFAULTS,
		...location
	}) as LocationModel;

// TODO: Make this a separate table
const LOCATIONS = [
	makeLocationWithDefaults({
		name: 'MIT Chapel',
		hint: 'A journey of a thousand miles begins with a single step',
		latitude: 42.35828799608816,
		longitude: -71.09420396931398,
		is_first: true,
		balance: 100
	}),
	makeLocationWithDefaults({
		name: 'St. Mary Orthodox Church',
		hint: 'Let us run to Mary, and, as her little children, cast ourselves into her arms with a perfect confidence.',
		latitude: 42.366907740875504,
		longitude: -71.10513514102031
	}),
	makeLocationWithDefaults({
		name: 'St. Andrew Ukrainian Orthodox Church of the USA',
		hint: 'Follow the one who was called first...',
		latitude: 42.30023759808764,
		longitude: -71.11104050111354
	}),
	makeLocationWithDefaults({
		name: 'Oculus at the Great Dome',
		hint: 'As you gaze upwards, just pretend someone could be looking back',
		latitude: 42.35974919397339,
		longitude: -71.09207127949416,
		is_first: true,
		type: 'secular',
		balance: 100
	}),
	makeLocationWithDefaults({
		name: 'Isabella Stewart Gardner Museum',
		hint: 'My garden is riotous, unholy, deliriously glorious! I wish you were here.',
		latitude: 42.338171372347034,
		longitude: -71.09904923614002,
		type: 'secular',
		balance: 100
	})
];

export const createLocationsForCoin = async (coin_id: string) =>
	Promise.all(
		LOCATIONS.map((location) =>
			createLocation({
				...location,
				coin_id
			})
		)
	);
