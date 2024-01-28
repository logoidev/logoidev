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

		if (json) {
			coin = json as Coin | null;
		} else {
			goto('/');
		}
	};

	const updateCoin = async (body: Partial<Coin>) => {
		const response = await fetch(`/c/${coin!.id}`, {
			method: 'POST',
			body: JSON.stringify(body)
		});
		coin = await response.json();
	};

	const increaseAmount = async ({
		detail: { amount: donated }
	}: {
		detail: { amount: number };
	}) => {
		const amount = coin ? coin.amount + donated : donated;
		return updateCoin({ amount });
	};

	// @ts-expect-error - Don't want to extend window right now
	window.flipColor = () => {
		const color = coin!.color === 'white' ? 'black' : 'white';
		return updateCoin({ color });
	};

	fetchCoin(coinId).catch((e) => console.error(e));
</script>

<div class="flex flex-col touch-manipulation items-center min-w-fit font-serif h-screen mt-6">
	<Header />

	{#if coin}
		<div
			class={clsx('p-4 aspect-square', {
				'grayscale invert bg-white rounded-full': coin.color === 'black',
				'!pb-2': flippedToFront
			})}
		>
			{#if flippedToFront}
				<RoundCodeWithParams id={coin.id} counter={coin.amount} />
			{:else}
				<RoundQR />
			{/if}
		</div>
	{/if}

	{#if isTopUpShown}
		<Payment cta="💵 Add value" on:success={increaseAmount} />
	{:else}
		<div class="flex gap-2">
			<button class={clsx('text-xl')} on:click={() => (isTopUpShown = true)}>💵 Add $1</button
			><button class="text-2xl" on:click={() => (flippedToFront = !flippedToFront)}>🔄</button>
		</div>
	{/if}

	<Socials />

	<Copyright fixed={!isTopUpShown} />
</div>
