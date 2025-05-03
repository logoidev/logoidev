import { browser } from '$app/environment';

const DEBUG_PARTYKIT_LOGS =
	import.meta.env.DEV || (browser ? localStorage.getItem('DEBUG_PARTYKIT_LOGS') === 'true' : false);

export const makeLog =
	(prefix: string) =>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(...args: any[]) => {
		if (DEBUG_PARTYKIT_LOGS) {
			console.log(prefix, ...args);
		}
	};
