<script lang="ts">
	import { onMount } from 'svelte';

	import '../app.css';
	import '../shared/fonts/index';
	import Spinner from 'src/components/Spinner.svelte';
	import { initializeAnalytics } from 'src/lib/analytics/posthog';
	import PresenceIndicator from 'src/components/PresenceIndicator.svelte';

	let loaded = false;

	onMount(() => {
		if (!loaded) {
			loaded = true;
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			window.IS_SVELTE = true;
		}

		initializeAnalytics();
	});
</script>

<PresenceIndicator />

{#if loaded}
	<slot />
{:else}
	<div class="w-screen h-screen flex items-center justify-center">
		<Spinner />
	</div>
{/if}
