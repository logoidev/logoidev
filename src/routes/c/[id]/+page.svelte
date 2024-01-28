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
	import MapLink from 'src/components/MapLink.svelte';

	let coinId = $page.params.id;
	let coin: CoinModel | null = null;
	let flippedToFront = true;
	let isTopUpShown = false;
	let locating = false;
	let showImThere = true;
	let gpsError = '';
	let error: '' | 'come_closer' = '';
	let distance: number;
	let destination: LocationModel;
	let redeemed = false;
	let iAmHereClicked = false;

	$: {
		console.log('C', coin);
		console.log('B', error, distance, destination, redeemed);
	}

	const fetchCoin = async (id: string) => {
		const response = await fetch(`/c/${id}`);
		const result = await response.json();

		if (result) {
			coin = result.coin;
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
		const balance = coin ? coin.balance! + donated : donated;
		return updateCoin({ balance });
	};

	type ApiResponse = {
		coin: CoinModel;
		distance: number;
		destination: LocationModel;
		error: '' | 'come_closer';
		redeemed: boolean;
	};
	const applyApiResult = (result: ApiResponse) => {
		coin = result.coin;
		distance = result.distance;
		destination = result.destination;
		error = result.error;
		redeemed = result.redeemed;
	};

	const updateCoinLocation = async (loc: Partial<LocationModel & { here?: boolean }>) => {
		const response = await fetch(`/c/${coinId}/locations`, {
			method: 'POST',
			body: JSON.stringify(loc)
		});
		const result = await response.json();
		applyApiResult(result);
	};

	const updateUserLocation = async () => {
		try {
			locating = true;

			// eslint-disable-next-line no-undef
			const { coords, timestamp } = await new Promise<GeolocationPosition>((resolve, reject) =>
				navigator.geolocation.getCurrentPosition(resolve, reject)
			);
			await updateCoinLocation({
				accuracy: coords.accuracy,
				latitude: coords.latitude,
				longitude: coords.longitude,
				timestamp
			});

			if (coin?.color !== 'white') {
				isTopUpShown = true;
			}
			// @ts-expect-error - same
		} catch (error: GeolocationPositionError) {
			switch (error.code) {
				case error.PERMISSION_DENIED:
					gpsError = 'We need GPS acces for this experience to work';
					break;
				case error.POSITION_UNAVAILABLE:
					gpsError = 'Could not get your location, please try again later';
					break;
				case error.TIMEOUT:
					gpsError = 'GPS connection timed out, please try again later';
					break;
				default:
					gpsError = 'Unexpected issues while getting your location';
					break;
			}
		} finally {
			locating = false;
		}
	};

	const flipColor = () => {
		const color = coin!.color === 'white' ? 'black' : 'white';
		return updateCoin({ color });
	};

	fetchCoin(coinId).catch((e) => console.error(e));
</script>

<div class="flex flex-col touch-manipulation items-center min-w-fit font-serif mt-6">
	<Header />

	{#if coin}
		<div
			class={clsx('p-4 aspect-square', {
				'grayscale invert bg-white rounded-full': coin.color === 'black',
				'!pb-2': flippedToFront
			})}
		>
			{#if flippedToFront}
				<RoundCodeWithParams id={coin.id} counter={coin.balance} />
			{:else}
				<RoundQR />
			{/if}
		</div>
	{/if}

	{#if isTopUpShown}
		<Payment cta="💵 Add value" on:success={increaseAmount} />
	{:else}
		<div class="text-2xl mt-6 flex items-center">
			<button class="text-2xl relative -left-32 -top-16" on:click={flipColor}> 🌗 </button>
			<button
				on:click={() => (coin?.step_index !== 0 ? (isTopUpShown = true) : updateUserLocation())}
			>
				{coin?.color === 'white' ? (coin?.step_index !== 0 ? '⬆️' : '⬇️') : '⬆️'}
			</button>
			<button
				class="text-2xl relative left-32 -top-16"
				on:click={() => (flippedToFront = !flippedToFront)}
			>
				🔄
			</button>
		</div>

		<button
			class="text-2xl border rounded px-4 py-2 flex items-center gap-1 mt-5"
			on:click={() => (coin?.step_index !== 0 ? (isTopUpShown = true) : updateUserLocation())}
		>
			<p class={clsx(locating && 'animate-bounce')}>{locating ? '📍' : '💵'}</p>
			<span>
				{coin?.color === 'white' ? (coin.step_index === 0 ? 'Get' : 'Give') : 'Pay'} $1
			</span>
		</button>

		{#if gpsError}
			<div class="mt-2 text-lg">{gpsError}</div>
		{/if}
	{/if}

	{#if destination}
		<div class="bg-white flex flex-col items-center text-center mt-4">
			<p>You need to get to</p>
			<div class="text-lg">{destination.name}</div>
			<p>Click the icon below and return<br /> to this page once you're there</p>
			{#if distance}
				<p class="text-sm">{`~ ${distance}m away`}</p>
			{/if}
			<MapLink
				title={destination.name}
				on:click={() => (showImThere = true)}
				url={`https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`}
				>Get there</MapLink
			>

			<a
				class="mb-4"
				title="Coming soon to Niantic"
				href="https://nianticlabs.com/src_external=logoi"
			>
				<img
					class="w-[6.5rem] border rounded px-4 py-2"
					alt="Soon on Niantic"
					src="/images/external-logos/niantic.png"
				/>
			</a>

			{#if showImThere}
				{#if !redeemed}
					<button
						on:click={() => {
							updateUserLocation();
							iAmHereClicked = true;
						}}
						class="border rounded px-4 py-2"
					>
						✅ I'm here
					</button>
				{/if}

				{#if iAmHereClicked && !locating && error === 'come_closer'}
					<div class="text-lg mt-2">
						Doesn't seem like it, you should <br />
						be within 20 meters of the bulding<br />
						go closer and try again!<br />
					</div>
				{:else if redeemed}
					<div>Great job!</div>
					<div>You are now encouraged to come inside!</div>
					<div>The balance of the coin will be donated to the building.</div>
					<div>Thank you! ❤️</div>
				{/if}
			{/if}
		</div>
	{/if}

	<Socials />

	<div class="mt-8" />
	<Copyright />
</div>
