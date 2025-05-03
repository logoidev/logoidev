import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { execSync } from 'child_process';
import path from 'path';
import 'dotenv/config';

import packageJson from './package.json';

const commit = execSync('git rev-parse --short HEAD').toString();

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			src: path.resolve(__dirname, './src'),
			party: path.resolve(__dirname, './party')
		}
	},
	server: {
		fs: {
			allow: [
				// Allow serving files from the project root and party directory
				path.resolve(__dirname, './party')
			]
		}
	},
	test: {
		passWithNoTests: true,
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	define: {
		'import.meta.env.VERSION': JSON.stringify(packageJson.version),
		'import.meta.env.COMMIT': JSON.stringify(commit),
		'import.meta.env.WITH_PARTYKIT': JSON.stringify(process.env.WITH_PARTYKIT)
	}
});
