import type { Writable } from 'svelte/store';
import { hasOnlyDigits } from './has-only-digits';
import { browser } from '$app/environment';

function getLocalStorage() {
	try {
		return localStorage;
	} catch (err) {
		return null;
	}
}

const USER_ID_KEY = 'user-id' as const;
const IS_ADMIN_KEY = 'is-admin' as const;

type LocalStorageKey = typeof USER_ID_KEY | typeof IS_ADMIN_KEY;

function getFromLocalStorage<T extends LocalStorageStorableType>(
	key: LocalStorageKey,
	fallbackValue = null
): T | null {
	const ls = getLocalStorage();
	const value: LocalStorageStorableType | null = ls?.getItem(key) ?? fallbackValue;

	if (value === null) {
		return null;
	}

	return stringToStorableValue(value) as T;
}

function storableValueToString(value: LocalStorageStorableType) {
	switch (typeof value) {
		case 'number':
		case 'boolean':
			return value.toString();
		default:
			return value;
	}
}

function stringToStorableValue(value: string): LocalStorageStorableType | null {
	if (value === 'true' || value === 'false') {
		return value === 'true';
	} else if (value === '') {
		return null;
	} else if (hasOnlyDigits(value)) {
		return parseFloat(value);
	} else {
		return value;
	}
}

function saveToLocalStorage(key: LocalStorageKey, value: LocalStorageStorableType) {
	const ls = getLocalStorage();
	const valueString = storableValueToString(value);
	ls?.setItem(key, valueString);
}

function clearLocalStorageValue(key: LocalStorageKey) {
	const ls = getLocalStorage();
	ls?.removeItem(key);
}

type LocalStorageStorableType = string | boolean | number;

type LocalStorageValue<T extends LocalStorageStorableType> = {
	key: LocalStorageKey;
	get: () => T | null;
	set: (value: T) => void;
	clear: () => void;
};

const getLocalStorageValue = <T extends LocalStorageStorableType>(
	key: LocalStorageKey
): LocalStorageValue<T> => ({
	key,
	get: () => getFromLocalStorage<T>(key),
	set: (value: LocalStorageStorableType) => saveToLocalStorage(key, value),
	clear: () => clearLocalStorageValue(key)
});

export const userIdLocalStorage = getLocalStorageValue<string>('user-id');
export const isAdminLocalStorage = getLocalStorageValue<boolean>('is-admin');

export const syncStoreToLocalStorage = <T extends LocalStorageStorableType>(
	writableStore: Writable<T>,
	localStorageValue: LocalStorageValue<T>
) => {
	if (!browser || typeof localStorage === 'undefined') {
		return;
	}

	writableStore.subscribe((value) => {
		if (value) {
			localStorageValue.set(value);
		} else {
			localStorageValue.clear();
		}
	});
};
