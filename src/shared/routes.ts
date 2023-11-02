import type { UserData } from '../types/user';
import { ORIGIN } from './constants';

export const getIndexUrl = (hash?: string) => (hash ? `${ORIGIN}#${hash}` : ORIGIN);

export const getUserUrl = (user: UserData) => `${ORIGIN}#${user.id}`;
