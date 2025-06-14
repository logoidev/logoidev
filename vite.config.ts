import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { execSync } from 'child_process';
import path from 'path';
import 'dotenv/config';
import tsconfigPaths from 'vite-tsconfig-paths';

import packageJson from './package.json';

const commit = execSync('git rev-parse --short HEAD').toString();

export default defineConfig({
	plugins: [tsconfigPaths(), sveltekit()],
	resolve: {
		alias: {
			'@src': path.resolve(__dirname, './src')
		}
	},
	server: {
		fs: {
			allow: [
				// Allow serving files from the project root and party directory
				path.resolve(__dirname, './party'),
				path.resolve(__dirname, './docs')
			]
		}
	},
	test: {
		passWithNoTests: true,
		include: ['src/**/*.test.ts', 'tests/**/*.test.ts', 'scripts/**/*.test.ts'],
		exclude: ['**/*.e2e-test.ts', '**/node_modules/**', '**/dist/**'],
		environment: 'node',
		globals: true
	},
	define: {
		'import.meta.env.VERSION': JSON.stringify(packageJson.version),
		'import.meta.env.COMMIT': JSON.stringify(commit),
		'import.meta.env.WITH_PARTYKIT': JSON.stringify(process.env.WITH_PARTYKIT)
	}
});
