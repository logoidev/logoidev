import { ORIGIN } from 'src/shared/constants';

export type LinkReferrer = 'copyright' | 'unimint' | 'academy' | 'coin';

export const SEARCH_TERM = 'r';

export const getFullMainUrl = (referrer: LinkReferrer, coinId?: string) => {
	if (referrer === 'coin') {
		return `${ORIGIN}?${SEARCH_TERM}=${referrer}&id=${coinId}`;
	}
	return `${ORIGIN}?${SEARCH_TERM}=${referrer}`;
};
export const COMPANY_LEGAL_NAME = 'Logoi Development Ltd.';

export const COMPANY_NAME = 'Logoi Development';
