import { PostHog } from 'posthog-node';

import { PUBLIC_POSTHOG_API_TOKEN } from '$env/static/public';
import type { Cookies } from '@sveltejs/kit';

const getPosthogInstance = () =>
	new PostHog(PUBLIC_POSTHOG_API_TOKEN, { host: 'https://us.i.posthog.com' });

const posthog = getPosthogInstance();

const getPosthogCookie = (cookies: Cookies) =>
	JSON.parse(cookies.get(`ph_${PUBLIC_POSTHOG_API_TOKEN}_posthog`) ?? '{}') as {
		distinct_id?: string;
	};

export const getDistinctId = (cookies: Cookies) => {
	const posthogCookie = getPosthogCookie(cookies);
	return posthogCookie.distinct_id; // Skipping uuidv7 generation as a fallback for now
};

type TrackingServerEvent = 'adam_direct_link_visited' | 'ref_link_visited';

export function trackServerEvent(
	eventName: TrackingServerEvent,
	cookies: Cookies,
	properties?: Record<string, string>
) {
	const distinctId = getDistinctId(cookies) ?? 'fallback-distinct-id';
	posthog.capture({ distinctId, event: eventName, properties });
}
