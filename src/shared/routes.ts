import type { UserData } from '../types/user';

const ORIGIN = 'https://logoi.dev';

export const CALENDAR_LINK = 'https://cal.com/logoi';

export const getIndexUrl = () => ORIGIN;

export const getUserUrl = (user: UserData) => `${ORIGIN}/${user.id}`;
