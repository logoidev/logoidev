import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { userLocalStorage, syncStoreToLocalStorage } from '../utility/local-storage';
import { createId } from 'src/utils/id';

export const currentUserId = writable<string>();

if (browser) {
	let savedUserId = userLocalStorage.get();
	if (!savedUserId) {
		savedUserId = createId('LGU');
	}
	currentUserId.set(savedUserId);
}

syncStoreToLocalStorage(currentUserId, userLocalStorage);
