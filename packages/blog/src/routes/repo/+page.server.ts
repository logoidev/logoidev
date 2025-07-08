import { redirect } from '@sveltejs/kit';

import { trackServerEvent } from 'src/lib/analytics/posthog.server';

const GITHUB_REDIRECT_LINK = 'https://github.com/logoidev/logoidev?ref=logoidev';

export function load({ cookies }) {
	trackServerEvent('ref_link_visited', cookies, {
		page: 'repo',
		label: 'GitHub',
		to: GITHUB_REDIRECT_LINK
	});
	redirect(303, GITHUB_REDIRECT_LINK);
}
