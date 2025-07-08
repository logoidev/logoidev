import { makeIndexGenerator } from '../utils/id-generator';

export type GenericEnum = Record<string, string>;

export const getEnumValuesArray = (enumValue: GenericEnum): Array<string> => {
	const enumEntries = Object.values<string>(enumValue);
	return enumEntries.slice(0, enumEntries.length / 2);
};

export const capitalizeFirst = (string: string) => string.at(0)?.toUpperCase() + string.slice(1);

export const stylesArrayToInline = (array: Array<string>, separator = ';') =>
	array.filter(Boolean).join(separator);

export function* idGenerator(baseId: string) {
	let index = 1;

	while (true) {
		yield `${baseId}-${index++}`;
	}
}

export const svgTextIdGenerator = makeIndexGenerator('svg-text');

export const pause = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
