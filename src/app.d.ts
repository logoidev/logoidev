// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

declare module '*.md' {
	export const metadata: {
		title: string;
		date: string;
		location: string;
		resolutionId: string;
	};
	export const html: string;
	export default {
		metadata,
		html
	};
}

export {};
