import { ORIGIN } from 'src/shared/constants';
import { get } from 'svelte/store';

export type LinkReferrer = 'copyright' | 'unimint' | 'academy' | 'coin';

export const SEARCH_TERM = 'r';

export const getFullMainUrl = (referrer: LinkReferrer, coinId?: string) => {
	const origin = get(ORIGIN);
	if (referrer === 'coin') {
		return `${origin}?${SEARCH_TERM}=${referrer}&id=${coinId}`;
	}
	return `${origin}?${SEARCH_TERM}=${referrer}`;
};
export const COMPANY_LEGAL_NAME = 'Logoi Development Ltd.';

export const COMPANY_NAME = 'Logoi Development';
