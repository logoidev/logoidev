import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { nodeLoaderPlugin } from '@vavite/node-loader/plugin';
import path from 'path';

import 'dotenv/config';

export default defineConfig({
	plugins: [nodeLoaderPlugin(), sveltekit()],
	resolve: {
		alias: {
			src: path.resolve(__dirname, './src')
		}
	},
	test: {
		passWithNoTests: true,
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
