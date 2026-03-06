import type { UserData } from '../types/user';
import { ORIGIN } from './constants';
import { get } from 'svelte/store';

export const getIndexUrl = (route?: string) => (route ? `${get(ORIGIN)}${route}` : get(ORIGIN));

export const getUserUrl = (user: UserData) => `${get(ORIGIN)}/${user.id}`;
