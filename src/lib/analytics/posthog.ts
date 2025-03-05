import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_API_TOKEN } from '$env/static/public';
import posthog from 'posthog-js';

let isInitialized = false;

export function initializeAnalytics() {
	if (isInitialized) {
		return;
	}

	if (browser) {
		posthog.init(PUBLIC_POSTHOG_API_TOKEN, {
			api_host: 'https://us.i.posthog.com',
			person_profiles: 'identified_only'
		});
		isInitialized = true;
	}
}

type TrackingEvent =
	| 'avatar_clicked'
	| 'pyramid_toggled'
	| 'unlock_attempted'
	| 'blogpost_clicked'
	| 'found_gold'
	| 'adam_link_visited'
	| 'chat_expanded';

export function trackEvent(
	eventName: TrackingEvent,
	properties?: Record<string, string | number | boolean | null>
) {
	posthog.capture(eventName, properties);
}
