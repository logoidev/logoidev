const DEBUG_PARTYKIT_LOGS =
	import.meta.env.DEV || localStorage.getItem('DEBUG_PARTYKIT_LOGS') === 'true';

export const makeLog =
	(prefix: string) =>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(...args: any[]) => {
		if (DEBUG_PARTYKIT_LOGS) {
			console.log(prefix, ...args);
		}
	};
