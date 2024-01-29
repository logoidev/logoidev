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
	step_index: 2
};

// TODO: Make this a separate table
const LOCATIONS: Array<Location> = [
	{
		name: 'MIT Chapel',
		hint: 'A journey of a thousand miles begins with a single step',
		latitude: 42.35828799608816,
		longitude: -71.09420396931398,
		balance: 100,
		is_first: true,
		step_index: 1
	},
	{
		name: 'St. Mary Orthodox Church',
		hint: 'Let us run to Mary, and, as her little children, cast ourselves into her arms with a perfect confidence.',
		latitude: 42.366907740875504,
		longitude: -71.10513514102031
	},
	{
		name: 'St. Andrew Ukrainian Orthodox Church of the USA',
		hint: 'Follow the one who was called first...',
		latitude: 42.30023759808764,
		longitude: -71.11104050111354
	},
	{
		name: 'Oculus at the Great Dome',
		hint: 'As you gaze upwards, just pretend someone could be looking back',
		latitude: 42.35974919397339,
		longitude: -71.09207127949416,
		type: 'secular',
		balance: 100,
		is_first: true,
		step_index: 1
	},
	{
		name: 'Isabella Stewart Gardner Museum',
		hint: 'My garden is riotous, unholy, deliriously glorious! I wish you were here.',
		latitude: 42.338171372347034,
		longitude: -71.09904923614002,
		type: 'secular',
		balance: 0
	},
	{ name: 'Holy Trinity Orthodox Cathedral', longitude: -71.0986196, latitude: 42.3416201 },
	{ name: 'Saint Clements Eucharistic Shrine', longitude: -71.0897034, latitude: 42.3469493 },
	{ name: 'First Church in Boston', longitude: -71.0745918, latitude: 42.3538454 },
	{ name: 'St. Mary Orthodox Church', longitude: -71.1050528, latitude: 42.3668639 },
	{ name: 'Central Square Church', longitude: -71.1050719, latitude: 42.3648118 },
	{
		name: 'Saints Constantine and Helen Greek Orthodox Church',
		longitude: -71.1051571,
		latitude: 42.3643573
	},
	{ name: 'Old Cambridge Baptist Church', longitude: -71.1141348, latitude: 42.3715953 },
	{ name: "St. Paul's Parish", longitude: -71.1156157, latitude: 42.3714339 },
	{
		name: 'The First Parish in Cambridge, Unitarian Universalist',
		longitude: -71.1191377,
		latitude: 42.3745899
	},
	{
		name: 'Basilica of Our Lady of Perpetual Help',
		longitude: -71.1000549,
		latitude: 42.3330247
	}
];

const locationsWithDefaults = LOCATIONS.map(
	(location) =>
		({
			...LOCATION_DEFAULTS,
			...location
		}) as Location
);

export const createLocationsForCoin = async (coinId: string) =>
	Promise.all(
		locationsWithDefaults.map((location) =>
			createLocation({
				...location,
				coin_id: coinId
			})
		)
	);
