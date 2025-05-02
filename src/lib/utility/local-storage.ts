import type { Writable } from 'svelte/store';

function getLocalStorage() {
	try {
		return localStorage;
	} catch (err) {
		return null;
	}
}

const USER_ID_KEY = 'user-id' as const;

type LocalStorageKey = typeof USER_ID_KEY;

function getFromLocalStorage(key: LocalStorageKey, fallbackValue = null) {
	const ls = getLocalStorage();
	return ls?.getItem(key) ?? fallbackValue;
}

function saveToLocalStorage(key: LocalStorageKey, value: string) {
	const ls = getLocalStorage();
	ls?.setItem(key, value);
}

function clearLocalStorageValue(key: LocalStorageKey) {
	const ls = getLocalStorage();
	ls?.removeItem(key);
}

type LocalStorageValue = {
	key: LocalStorageKey;
	get: () => string | null;
	set: (value: string) => void;
	clear: () => void;
};

const getLocalStorageValue = (key: LocalStorageKey): LocalStorageValue => ({
	key,
	get: () => getFromLocalStorage(key),
	set: (value: string) => saveToLocalStorage(key, value),
	clear: () => clearLocalStorageValue(key)
});

export const userLocalStorage = getLocalStorageValue('user-id');

export const syncStoreToLocalStorage = (
	writableStore: Writable<string>,
	localStorageValue: LocalStorageValue
) => {
	writableStore.subscribe((value) => {
		if (value) {
			localStorageValue.set(value);
		} else {
			localStorageValue.clear();
		}
	});
};
