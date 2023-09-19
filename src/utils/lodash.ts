/* eslint-disable @typescript-eslint/no-explicit-any */

export const groupBy = <T extends Record<string, any>>(array: Array<T>, property: keyof T) => {
	const emptyGroup = {} as Record<keyof T, any>;

	const result = array.reduce((grouped, arrayItem) => {
		const value = arrayItem[property];

		if (grouped[value]) {
			grouped[value].push(arrayItem);
		} else {
			grouped[value] = [arrayItem];
		}

		return grouped;
	}, emptyGroup);

	return result;
};

type ObjectMapper<T> = (key: keyof T, value: any) => any;
export const mapValues = <T extends Record<string, any>>(object: T, mapper: ObjectMapper<T>): T => {
	const result = {} as T;

	for (const key in object) {
		result[key] = mapper(key, object[key]);
	}

	return result;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noopWithParam = <Param = undefined>(param: Param) => {
	return;
};

export const noop = () => {
	return;
};
