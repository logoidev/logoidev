import { redirect } from '@sveltejs/kit';

import { trackServerEvent } from 'src/lib/analytics/posthog.server';

const ST_SOPHIA_REDIRECT_LINK =
	'https://www.zeffy.com/donation-form/please-donate-to-st-sophia?via=logoidev';

export function load({ cookies }) {
	trackServerEvent('ref_link_visited', cookies, {
		page: 'sophia',
		label: 'St. Sophia - Zeffy',
		to: ST_SOPHIA_REDIRECT_LINK
	});
	redirect(303, ST_SOPHIA_REDIRECT_LINK);
}
