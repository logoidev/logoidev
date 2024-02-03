import { ORIGIN } from 'src/shared/constants';

export type LinkReferrer = 'copyright' | 'unimint' | 'academy';

export const SEARCH_TERM = 'q';

export const getFullMainUrl = (referrer: LinkReferrer) => `${ORIGIN}?${SEARCH_TERM}=${referrer}`;
export const COMPANY_LEGAL_NAME = 'Logoi Development Ltd.';
