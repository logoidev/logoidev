import { redirect } from '@sveltejs/kit';
import { trackServerEvent } from 'src/lib/analytics/posthog.server';
import { CALENDAR_LINK } from 'src/shared/constants.js';

export function load({ cookies }) {
	trackServerEvent('ref_link_visited', cookies, {
		page: 'cal',
		label: 'Calendar',
		to: CALENDAR_LINK
	});
	redirect(303, CALENDAR_LINK);
}
