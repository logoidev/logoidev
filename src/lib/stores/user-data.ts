import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import {
	userIdLocalStorage,
	syncStoreToLocalStorage,
	isAdminLocalStorage
} from '../utility/local-storage';
import { createId } from 'src/utils/id';

export const currentUserId = writable<string>();

export const isAdmin = writable<boolean>(true);

if (browser) {
	let savedUserId = userIdLocalStorage.get();
	if (!savedUserId) {
		savedUserId = createId('LGU');
	}
	currentUserId.set(savedUserId);
}

syncStoreToLocalStorage(currentUserId, userIdLocalStorage);
syncStoreToLocalStorage(isAdmin, isAdminLocalStorage);
