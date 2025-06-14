import { redirect } from '@sveltejs/kit';
import { getResolutionById } from '$lib/resolutions';
import type { PageLoadEvent } from './$types';
import { getResolutionContent } from '$lib/resolutions.server';
import type { ResolutionWithContent } from 'src/lib/types';

export async function load({ params: { id } }: PageLoadEvent) {
	const resolution = getResolutionById(id);
	if (!resolution) {
		redirect(302, '/resolutions');
	}

	try {
		const content = await getResolutionContent(resolution.id);
		const resolutionWithContent: ResolutionWithContent = {
			...resolution,
			content
		};
		return {
			resolution: resolutionWithContent
		};
	} catch (e) {
		console.error('Could not load resolution', e);
		return {
			error: 'Could not load resolution',
			resolution: null
		};
	}
}
