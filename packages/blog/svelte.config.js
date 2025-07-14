import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
export default {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess()],

	extensions: ['.svelte', '.md'],

	kit: {
		adapter: adapter({
			// https://kit.svelte.dev/docs/adapter-vercel#deployment-configuration
			prerender: {
				enabled: false
			},
			ssr: {
				noExternal: [
					'@types/qrcode',
					'canvg',
					'clsx',
					'nanoid',
					'qrcode',
					'reflect-metadata',
					'sqlite',
					'sqlite3',
					'stripe',
					'typeorm'
				]
			}
		}),
		alias: {
			'src/*': './src/*',
			'party/*': './party/*'
		}
	}
};
