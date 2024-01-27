<script lang="ts">
	import Header from '../../../components/Header.svelte';
	import Copyright from '../../../components/Copyright.svelte';
	import RoundCodeWithParams from '../../../components/RoundCode/RoundCodeWithParams.svelte';
	import RoundQR from '../../../components/QR/RoundQR/RoundQR.svelte';

	import type { Coin } from './types';

	export let data: Coin | null;

	const coin = data;

	$: {
		console.log('Log', coin);
	}
</script>

<div class="flex flex-col touch-manipulation items-center min-w-fit font-serif h-screen mt-12">
	<Header />

	{#if coin}
		<RoundCodeWithParams id={coin.id} />
	{/if}

	<br />

	<RoundQR />

	<Copyright />
</div>
