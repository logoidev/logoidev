import { dev } from '$app/environment';

export const ORIGIN = dev ? 'http://localhost:5173' : 'https://logoi.dev';

export const ORIGIN_FOUNDATION = dev ? `${ORIGIN}/foundation` : 'https://logoi.foundation';

export const CALENDAR_LINK = 'https://cal.com/logoi-v';

export const ADMIN_COIN_ID = 'LGI:01010101010';

export const SERVER_LOG = false;
//  Must be on for prod
export const DISABLE_DISTANCE_CHECK = false; // false
export const DISTANCE_LIMIT_M = 20; // 20
