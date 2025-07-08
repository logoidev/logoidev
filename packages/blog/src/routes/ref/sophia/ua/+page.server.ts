import { redirect } from '@sveltejs/kit';

import { trackServerEvent } from 'src/lib/analytics/posthog.server';

const ST_SOPHIA_UKRAINE_REDIRECT_LINK = 'https://www.zeffy.com/donation-form/help-ukraine';

export function load({ cookies }) {
	trackServerEvent('ref_link_visited', cookies, {
		page: 'sophia',
		label: 'St. Sophia Ukraine - Zeffy',
		to: ST_SOPHIA_UKRAINE_REDIRECT_LINK
	});
	redirect(303, ST_SOPHIA_UKRAINE_REDIRECT_LINK);
}
