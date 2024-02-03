<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import '../app.css';
	import '../shared/fonts/index';
	import Spinner from 'src/components/Spinner.svelte';
	import AnalyticsScripts from 'src/components/AnalyticsScripts.svelte';

	let loaded = false;

	onMount(() => {
		if (!loaded) {
			loaded = true;
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			window.IS_SVELTE = true;
		}
	});
</script>

<svelte:head>
	<script defer type="module" src="/react/index.js"></script>
</svelte:head>

<link rel="stylesheet" href="/react/index.css" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
<link
	href="https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap"
	rel="stylesheet"
/>

{#if browser && window.location.hash === '/quest'}
	<div id="react-root"></div>
{/if}

{#if loaded}
	<slot />
{:else}
	<div class="w-screen h-screen flex items-center justify-center">
		<Spinner />
	</div>
{/if}

<AnalyticsScripts />
