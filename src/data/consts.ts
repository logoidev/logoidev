export type LinkReferrer = 'copyright' | 'unimint' | 'academy';

export const WEBSITE_MAIN_URL = 'https://logoi.dev';
export const SEARCH_TERM = 'q';

export const getFullMainUrl = (referrer: LinkReferrer) =>
	`${WEBSITE_MAIN_URL}?${SEARCH_TERM}=${referrer}`;
export const COMPANY_LEGAL_NAME = 'Logoi Development Ltd.';
