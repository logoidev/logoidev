<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from 'src/components/Header.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import RoundCodeWithParams from 'src/components/RoundCode/RoundCodeWithParams.svelte';
	import RoundQR from 'src/components/QR/RoundQR/RoundQR.svelte';

	import type { Coin } from 'src/db/entity/coin';
	import { page } from '$app/stores';
	import Payment from 'src/components/Payment/Payment.svelte';

	import Socials from 'src/components/Socials/Socials.svelte';
	import clsx from 'clsx';

	let coinId = $page.params.id;
	let coin: Coin | null = null;
	let flippedToFront = true;
	let isTopUpShown = false;

	const fetchCoin = async (id: string) => {
		const response = await fetch(`/c/${id}`);
		const json = await response.json();
		return json as Coin | null;
	};

	const increaseAmount = async ({
		detail: { amount: donated }
	}: {
		detail: { amount: number };
	}) => {
		const amount = coin ? coin.amount + donated : donated;
		const response = await fetch(`/c/${coin!.id}`, {
			method: 'POST',
			body: JSON.stringify({ amount })
		});
		coin = await response.json();
	};

	fetchCoin(coinId).then((c) => {
		if (c) {
			coin = c;
		} else {
			goto('/');
		}
	});
</script>

<div class="flex flex-col touch-manipulation items-center min-w-fit font-serif h-screen mt-6">
	<Header />

	{#if coin}
		{#if flippedToFront}
			<RoundCodeWithParams id={coin.id} counter={coin.amount} />
		{:else}
			<RoundQR />
		{/if}

		<button
			class="absolute right-[25%] top-[540px] text-2xl"
			on:click={() => (flippedToFront = !flippedToFront)}>🔄</button
		>
	{/if}

	{#if isTopUpShown}
		<Payment cta="💵 Add value" on:success={increaseAmount} />
	{:else}
		<button
			class={clsx('text-xl', { 'mt-4': !flippedToFront })}
			on:click={() => (isTopUpShown = true)}>💵 Add $1</button
		>
	{/if}

	<Socials />

	<Copyright />
</div>
