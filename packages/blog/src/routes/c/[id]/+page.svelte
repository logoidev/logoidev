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
	import Spinner from 'src/components/Spinner.svelte';
	import {
		DISTANCE_LIMIT_M,
		ENABLE_CLAIM_RECEIPT_FORM,
		ORIGIN_FOUNDATION
	} from 'src/shared/constants';
	import { getErrorMessage } from 'src/utils/get-error-messge';
	import CoinInfo from 'src/components/CoinInfo.svelte';
	import { trackEvent } from 'src/lib/analytics/posthog';

	let coinId = $page.params.id;
	let coin: CoinModel | null = null;
	let flippedToFront = true;
	let isTopUpShown = false;
	let locating = false;
	let showImThere = true;
	let gpsError = '';
	let error: string | '' | 'come_closer' = '';
	let distance: number;
	let destination: LocationModel;
	let iAmHereClicked = false;
	let rewardWanted = true;
	let isFetchingCoin = false;
	let moreInfo = false;
	// TODO: This in theory is not needed and trips could be infinite
	$: redeemed = coin?.step_index && coin?.step_index >= 3;
	// TODO: This needs not to be based on color
	$: secular = coin?.color === 'black';
	$: coinColor = coin?.color ?? 'white';

	$: {
		console.log('Debug', { coin, coinColor, error, distance, destination, redeemed });
	}

	const fetchCoin = async (id: string) => {
		isFetchingCoin = true;
		try {
			const response = await fetch(`/c/${id}`);
			const result = await response.json();

			if (result) {
				applyApiResult(result);
			} else {
				goto('/');
			}
		} catch (e) {
			console.error(e);
			error = getErrorMessage(error);
		} finally {
			isFetchingCoin = false;
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
		trackEvent('donation_balance_increased', { donated, coin_id: coinId });
		return updateCoin({ balance });
	};

	type ApiResponse = {
		coin: CoinModel;
		distance: number;
		destination: LocationModel;
		error: '' | 'come_closer';
	};

	const applyApiResult = (result: ApiResponse) => {
		coin = result.coin;
		distance = result.distance;
		destination = result.destination;
		error = result.error;
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

			trackEvent('location_point_updated', {
				timestamp,
				lat: coords.latitude,
				lon: coords.longitude
			});
			await updateCoinLocation({
				accuracy: coords.accuracy,
				latitude: coords.latitude,
				longitude: coords.longitude,
				timestamp
			});

			// if (secular) {
			// 	isTopUpShown = true;
			// }

			// @ts-expect-error - same
		} catch (error: GeolocationPositionError) {
			trackEvent('location_point_updated', error);
			switch (error.code) {
				case error.PERMISSION_DENIED:
					gpsError = 'Please allow location access for this feature to work';
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
		trackEvent('color_flipped');
		coinColor = coinColor === 'white' ? 'black' : 'white';
	};

	const onRewardClicked = () => {
		if (rewardWanted) {
			rewardWanted = false;
			trackEvent('reward_clicked');
		} else {
			trackEvent('star_clicked');
			const button = document.getElementById('cta');
			button?.scrollIntoView({
				behavior: 'auto',
				block: 'center',
				inline: 'center'
			});
			button?.focus();
		}
	};

	const openGoogleMaps = () => {
		const mapLink = document.getElementById('logoi-icon-pin');
		mapLink?.click();
	};

	const formatMeters = (meters: number) => {
		let metric = 'm';
		let value = meters;

		if (value >= 1000) {
			value = Math.ceil(value / 1000);
			metric = 'km';
		}

		return `${value}${metric}`;
	};

	fetchCoin(coinId).catch((e) => console.error(e));
</script>

<div class="flex flex-col touch-manipulation items-center min-w-fit font-serif mt-6">
	<Header />

	{#if isFetchingCoin}
		<div class="mt-4">Getting something special for you...</div>
		<div
			class="flex items-center justify-center mt-6 w-60 h-60 border border-gray-200 bg-gray-100 animate-pulse rounded-full"
		>
			<Spinner />
		</div>
	{:else if coin}
		<div class="my-4 text-center">
			<div>This is a unique coin and it's yours.</div>
			<div>It will lead you to a special place</div>
			<div>
				And there's a <button class={clsx(rewardWanted && 'underline')} on:click={onRewardClicked}>
					{rewardWanted ? 'reward' : '⭐'}
				</button> at the end
			</div>
			<div>It's worth it!</div>
		</div>
		<div
			class={clsx('p-4 aspect-square ', {
				'grayscale invert bg-white rounded-full': coinColor === 'black',
				'!bg-[#700000]': redeemed && coinColor === 'black' && flippedToFront,
				'!pb-2': flippedToFront,
				redeemed
			})}
		>
			{#if flippedToFront}
				<RoundCodeWithParams
					id={coin.id}
					counter={coin.balance}
					color={redeemed ? 'gold' : 'black'}
				/>
			{:else}
				<RoundQR />
			{/if}
		</div>
	{/if}

	{#if coin && isTopUpShown}
		<Payment destination="coin" cta="💵 Add value" {coinId} on:success={increaseAmount} />
	{:else}
		<div class="text-2xl mt-6 flex items-center">
			<button class="text-2xl relative -left-32 -top-16" on:click={flipColor}> 🌗 </button>
			<button
				on:click={() => (coin?.step_index !== 0 ? (isTopUpShown = true) : updateUserLocation())}
			>
				{secular ? '⬆️' : coin?.step_index !== 0 ? '⬆️' : '⬇️'}
			</button>
			<button
				class="text-2xl relative left-32 -top-16"
				on:click={() => {
					trackEvent('coin_flipped');
					flippedToFront = !flippedToFront;
				}}
			>
				🔄
			</button>
		</div>

		{#if !isFetchingCoin && coin}
			<button
				id="cta"
				disabled={locating}
				class={clsx(
					'text-2xl border rounded px-4 py-2 flex items-center gap-1 mt-5 focus:border-blue-500'
				)}
				on:click={() => (coin?.step_index !== 0 ? (isTopUpShown = true) : updateUserLocation())}
			>
				<p class={clsx(locating && 'animate-bounce')}>{locating ? '📍' : '💵'}</p>
				<span>
					{secular && coin.step_index === 0 ? 'Pay' : coin.step_index === 0 ? 'Get' : 'Give'} $1
				</span>
			</button>

			{#if gpsError}
				<div class="mt-2 text-lg">{gpsError}</div>
			{/if}
		{/if}
	{/if}

	{#if destination}
		<div class="bg-white flex flex-col items-center text-center mt-4">
			<p>{redeemed ? 'You went to' : 'You need to get to'}</p>
			<button class="text-xl" on:click={openGoogleMaps}>
				{destination.name}
			</button>
			{#if !redeemed}
				<p>Click the icon below and return<br /> to this page once you're there</p>
				{#if distance}
					<p class="text-sm">{`~ ${formatMeters(distance)} away`}</p>

					{#if distance > 1500}
						<p class="text-center mt-4 text-sm">
							Seems like you're quite far away, the experience currently works only in Boston, MA
							and we're working on expanding it to other cities.
						</p>
					{/if}
				{/if}
			{/if}

			<button class="mt-6" on:click={openGoogleMaps}> Navigate </button>
			<MapLink
				title={destination.name}
				url={`https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`}
				on:click={() => {
					showImThere = true;
					trackEvent('map_link_clicked');
				}}
			>
				Get there
			</MapLink>

			{#if showImThere}
				{#if !redeemed}
					<button
						class="flex items-center border rounded px-4 py-2 disabled:cursor-not-allowed"
						disabled={locating}
						on:click={() => {
							updateUserLocation();
							iAmHereClicked = true;
						}}
					>
						{#if locating}
							<div class="w-8 h-8 overflow-hidden">
								<Spinner />
							</div>
						{:else}
							✅
						{/if}
						I'm here
					</button>
				{/if}

				{#if iAmHereClicked && !locating && error === 'come_closer'}
					<div class="text-lg mt-2">
						Doesn't seem like it, you should <br />
						be within {DISTANCE_LIMIT_M} meters of the bulding<br />
						go closer and try again!<br />
					</div>
				{:else if redeemed}
					<div>Great job!</div>
					<div>You are now encouraged to come inside!</div>
					<div>The balance of the coin will be donated to the building.</div>
					<div>But you can keep the coin, it's now {secular ? 'silver 🪙' : 'golden ⭐'}</div>
					<br />
					<div>Thank you! ❤️</div>
				{/if}

				{#if coin?.claim_receipt_url}
					<div class="mt-4 border border-[gold] rounded px-4 py-2">
						<p>The value of the coin has been donated to the {secular ? 'location' : 'church'}</p>
						<a class="underline text-blue-500" target="_blank" href={coin.claim_receipt_url}>
							View donation receipt
						</a>
					</div>
				{/if}
			{/if}
		</div>
	{/if}

	{#if moreInfo}
		<div class="flex flex-col items-center mt-32">
			<a class="underline mb-8" href="/blog/logoi" target="_blank"
				>Read an article explaining Logoi</a
			>

			<p>{coin?.id}</p>
			<CoinInfo {coin} withUrl={false} />

			<a class="mb-8 border border-1 py-2 px-4 rounded" href={`/c/${coinId}/p`}>Print</a>
			<p class="opacity-60 font-sans text-sm">There's an early alpha build of this</p>
			<p class="opacity-60 font-sans text-sm">project using AR navigation</p>
			<a
				class="mt-4 cursor-pointer opacity-75 border-dashed border rounded border-[#ef4b25]"
				target="_blank"
				title="Please contact for pre-alpha"
				href="mailto:vlad@logoi.dev?subject=Logoi - Requesting alpha acess to Niantic 8th Wall demo"
			>
				<img
					class="w-[6.5rem] rounded px-4 py-2"
					alt="Soon on Niantic"
					src="/images/external-logos/niantic.png"
				/>
			</a>
		</div>

		<div class="flex flex-col items-center mt-16">
			<p class="opacity-60 font-sans text-sm">Initial version built in collaboration with:</p>
			<br />
			<div class="flex flex-row justify-center items-center gap-8 relative left-4">
				<a title="MIT Media Lab" href="https://www.media.mit.edu/">
					<img class="w-[6rem] -ml-8 rounded" alt="MIT" src="/images/external-logos/mit.svg" />
				</a>

				<a title="Orthodox Church in America" href="https://www.oca.org/">
					<img
						class="h-[6rem] rounded"
						alt="Orthodox Church in America"
						src="/images/external-logos/oca.png"
					/>
				</a>

				<a title="Reality Hack" href="https://www.mitrealityhack.com/">
					<img
						class="w-[6rem] rounded"
						alt="MIT Reality Hack 2024"
						src="/images/external-logos/realityhack.png"
					/>
				</a>
			</div>

			<div class="mt-8 opacity-60 font-sans text-sm">
				And a beautiful City of Boston that inspired us
			</div>
			<a class="mt-8" title="City of Boston" href="https://www.boston.gov/">
				<img
					class="w-[6rem] rounded"
					alt="City of Boston Emblem"
					src="/images/external-logos/boston.png"
				/>
			</a>

			<div class="my-8 opacity-60 font-sans text-sm">Donations powered by</div>
			<a class="flex flex-col" href={`${ORIGIN_FOUNDATION}?src_external=development`}>
				<img class="h-16" alt="Logoi Foundation Logo" src="/images/logoi-foundation.svg" />
				<span class={`text-sm text-center mt-4 font-trajan`}>Foundation</span>
			</a>
		</div>
	{:else}
		<button
			class="text-xl font-serif mt-32 opacity-75 underline"
			on:click={() => (moreInfo = true)}
		>
			More info
		</button>
	{/if}

	<div class="mt-8" />
	<Socials withToggle />

	<Copyright />

	{#if ENABLE_CLAIM_RECEIPT_FORM}
		<form
			class="shadow p-2 m-2"
			on:submit={(e) => {
				e.preventDefault();
				// @ts-expect-error - TODO: Move this away from inline later
				const input = e.target.elements['claim_receipt_url'];
				const claim_receipt_url = input.value;
				updateCoin({ claim_receipt_url });
			}}
		>
			<input
				class="border px-2 py-1 rounded"
				type="url"
				required
				name="claim_receipt_url"
				value={coin?.claim_receipt_url}
			/>
			<button>Update</button>
		</form>
	{/if}
</div>

<style>
	.redeemed.grayscale.invert :global(.coin-counter) {
		fill: white !important;
	}
</style>
