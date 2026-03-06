import { get } from 'svelte/store';
import { ORIGIN_FOUNDATION } from 'src/shared/constants.js';

const IS_FOUNDATION_TEST = false;

export async function load({ url }) {
	const origin = IS_FOUNDATION_TEST ? get(ORIGIN_FOUNDATION) : url.origin;
	return { origin };
}
