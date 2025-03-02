import { redirect } from '@sveltejs/kit';

import { trackServerEvent } from 'src/lib/analytics/posthog.server';

const ADAM_CUSTOM_CHAT_GPT_REDIRECT_LINK =
	'https://chatgpt.com/g/g-67bf48c4932881918f63f2197d68ec57-adam';

export function load({ cookies }) {
	trackServerEvent('adam_direct_link_visited', cookies);
	redirect(303, ADAM_CUSTOM_CHAT_GPT_REDIRECT_LINK);
}
