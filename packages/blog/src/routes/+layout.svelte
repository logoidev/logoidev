<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import '../app.css';
	import '../shared/fonts/index';
	import Spinner from 'src/components/Spinner.svelte';
	import { initializeAnalytics } from 'src/lib/analytics/posthog';
	import { dev } from '$app/environment';
	import { ORIGIN, ORIGIN_FOUNDATION } from 'src/shared/constants';

	let loaded = false;

	onMount(() => {
		if (!loaded) {
			loaded = true;
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			window.IS_SVELTE = true;
		}

		if (dev) {
			const origin = page.url.origin;
			ORIGIN.set(origin);
			ORIGIN_FOUNDATION.set(`${origin}/foundation`);
		}

		initializeAnalytics();
	});
</script>

{#if loaded}
	<slot />
{:else}
	<div class="w-screen h-screen flex items-center justify-center">
		<Spinner />
	</div>
{/if}
