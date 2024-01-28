import type { UserData } from '../types/user';
import { ORIGIN } from './constants';

export const getIndexUrl = (route?: string) => (route ? `${ORIGIN}/${route}` : ORIGIN);

export const getUserUrl = (user: UserData) => `${ORIGIN}/${user.id}`;
