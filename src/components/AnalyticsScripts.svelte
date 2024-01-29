<script context="module" lang="ts">
	import { browser } from '$app/environment';

	export const trackAnalyticsEvent = (
		event: string,
		{ eventName = 'event', ...extra }: Record<string, string | number | boolean> = {}
	) => {
		if (browser) {
			window.gtag(eventName, event, {
				...extra,
				page_title: document.title
			});
		}
	};
</script>

<script>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-nocheck
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';

	$: {
		if (browser) {
			window.dataLayer = window.dataLayer || [];

			// eslint-disable-next-line svelte/no-inner-declarations
			function gtag() {
				window.dataLayer.push(arguments);
			}

			window.gtag = gtag;

			gtag('js', new Date());
			gtag('config', env.PUBLIC_GOOGLE_MEASUREMENT_ID, {
				page_title: document.title,
				page_path: $page.url.pathname
			});
		}
	}
</script>

<svelte:head>
	<script
		async
		src={`https://www.googletagmanager.com/gtag/js?id=${env.PUBLIC_GOOGLE_MEASUREMENT_ID}`}
	>
	</script>
</svelte:head>
