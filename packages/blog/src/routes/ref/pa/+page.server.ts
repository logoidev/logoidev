import { redirect } from '@sveltejs/kit';

import { trackServerEvent } from 'src/lib/analytics/posthog.server';

const PA_REDIRECT_LINK = 'https://petersonacademy.com/?via=logoidev';

export function load({ cookies }) {
	trackServerEvent('ref_link_visited', cookies, {
		page: 'pa',
		label: 'Peterson Academy',
		to: PA_REDIRECT_LINK
	});
	redirect(303, PA_REDIRECT_LINK);
}
