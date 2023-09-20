import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			// https://rollupjs.org/configuration-options/
			output: {
				chunkFileNames: '[name][extname]',
				assetFileNames: '[name][extname]',
				entryFileNames: `[name].js`
			}
		}
	}
});
