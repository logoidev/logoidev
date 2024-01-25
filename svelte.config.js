import { vitePreprocess } from '@sveltejs/kit/vite';

import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
export default {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// https://kit.svelte.dev/docs/adapter-vercel#deployment-configuration
		}),
		alias: {
			'src/*': './src/*'
		}
	}
};
