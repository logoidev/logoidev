export const getErrorMessage = (error: unknown, fallback = 'Unknown Error') => {
	if (error instanceof Error) {
		return error.message || fallback;
	}

	if (typeof error === 'string') {
		return error || fallback;
	}

	return String(error || '') || fallback;
};
