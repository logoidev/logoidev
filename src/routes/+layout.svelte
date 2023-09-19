<script lang="ts">
	import { onMount } from 'svelte';

	import '../app.css';
	import '../shared/fonts/index';
	import Spinner from '../components/Spinner.svelte';

	let loaded = false;

	onMount(() => {
		if (!loaded) {
			loaded = true;
		}
	});
</script>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
<link
	href="https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap"
	rel="stylesheet"
/>

{#if loaded}
	<slot />
{:else}
	<div class="w-screen h-screen flex items-center justify-center">
		<Spinner />
	</div>
{/if}
