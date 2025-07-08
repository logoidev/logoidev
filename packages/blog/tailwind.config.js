/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['ui-sans-serif', 'system-ui'],
			serif: ['ui-serif'],
			mono: ['ui-monospace', 'SFMono-Regular'],
			trajan: ['"Trajan Pro"', 'ui-serif'],
			pomorsky: ['Pomorsky', 'ui-serif']
		},
		extend: {}
	},
	plugins: [require('@tailwindcss/typography')]
};
