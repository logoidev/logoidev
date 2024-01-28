<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from 'src/components/Header.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import RoundCodeWithParams from 'src/components/RoundCode/RoundCodeWithParams.svelte';
	import RoundQR from 'src/components/QR/RoundQR/RoundQR.svelte';

	import type { CoinModel } from 'src/db/entity/coin';
	import type { LocationModel } from 'src/db/entity/location';
	import { page } from '$app/stores';
	import Payment from 'src/components/Payment/Payment.svelte';

	import Socials from 'src/components/Socials/Socials.svelte';
	import clsx from 'clsx';

	let coinId = $page.params.id;
	let coin: CoinModel | null = null;
	let flippedToFront = true;
	let isTopUpShown = false;
	let locating = false;

	const fetchCoin = async (id: string) => {
		const response = await fetch(`/c/${id}`);
		const json = await response.json();

		if (json) {
			coin = json as CoinModel | null;
		} else {
			goto('/');
		}
	};

	const updateCoin = async (body: Partial<CoinModel>) => {
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

	const fetchSyncLocation = async (loc: Partial<LocationModel>) => {
		console.log('Saving loc', loc);
		const response = await fetch(`/c/${coinId}/locations`, {
			method: 'POST',
			body: JSON.stringify(loc)
		});
		const location = await response.json();
		console.log('Saved location to DB', location);
		return location;
	};

	const updateUserLocation = async () => {
		try {
			locating = true;

			// eslint-disable-next-line no-undef
			const { coords, timestamp } = await new Promise<GeolocationPosition>((resolve, reject) =>
				navigator.geolocation.getCurrentPosition(resolve, reject)
			);
			const location: Pick<
				LocationModel,
				'accuracy' | 'latitude' | 'longitude' | 'timestamp' | 'stage'
			> = {
				accuracy: coords.accuracy,
				latitude: coords.accuracy,
				longitude: coords.longitude,
				timestamp,
				stage: 'initial'
			};
			await fetchSyncLocation(location);
			isTopUpShown = true;
		} catch (error) {
			console.log('E', error);
		} finally {
			locating = false;
		}
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
		<div class="flex items-center">
			<button class={'text-xl flex items-center gap-1'} on:click={updateUserLocation}>
				<p class={clsx(locating && 'animate-bounce')}>{locating ? '📍' : '💵'}</p>
				<span>Add $1</span>
			</button>
			<button class="text-2xl relative left-12" on:click={() => (flippedToFront = !flippedToFront)}>
				🔄
			</button>
		</div>
	{/if}

	<Socials />

	<Copyright fixed={!isTopUpShown} />
</div>
