<script lang="ts">
	import { goto } from '$app/navigation';
	import Copyright from 'src/components/Copyright.svelte';
	import RoundCodeWithParams from 'src/components/RoundCode/RoundCodeWithParams.svelte';
	import RoundQR from 'src/components/QR/RoundQR/RoundQR.svelte';

	import type { CoinModel } from 'src/db/entity/coin';
	import type { LocationModel } from 'src/db/entity/location';
	import { page } from '$app/stores';

	import clsx from 'clsx';
	import Spinner from 'src/components/Spinner.svelte';

	import { getErrorMessage } from 'src/utils/get-error-messge';
	import { ORIGIN } from 'src/shared/constants';
	import Header from 'src/components/Header.svelte';

	let coinId = $page.params.id;
	let coin: CoinModel | null = null;
	let error: string | '' | 'come_closer' = '';
	let distance: number;
	let destination: LocationModel;
	let showControls = false;
	let isVertical = true;
	let withLogo = true;
	let withTime = false;

	$: timeFormatMethod = withTime ? ('toLocaleString' as const) : ('toLocaleDateString' as const);
	$: created = new Date(coin?.created_at ?? '')[timeFormatMethod]?.();
	$: now = new Date()[timeFormatMethod]?.();

	if (created === now) {
		withTime = true;
	}

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	let isFetchingCoin = false;
	let scale = 1;
	// TODO: This in theory is not needed and trips could be infinite
	$: redeemed = coin?.step_index && coin?.step_index >= 3;
	// TODO: This needs not to be based on color

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

	fetchCoin(coinId).catch((e) => console.error(e));
</script>

<div class="flex flex-col touch-manipulation items-center min-w-fit font-serif my-4">
	<div class="flex flex-col mt-6 text-center">
		{#if withLogo}
			<Header />
		{/if}
		<a class="text-lg" href={`${ORIGIN}/c/${coinId}`}>{`${ORIGIN}/c/${coinId}`}</a>
		{#if !isFetchingCoin}
			<span>Created: {created}</span>
			<span>Now: {now}</span>
			<span>{timezone}</span>
		{/if}
		<a class="mt-2" href={`mailto:hi@logoi.dev?subject=Help with coin&body=Coin ID: ${coin?.id}`}>
			hi@logoi.dev
		</a>
		<Copyright class="!-mt-2" withLink referrer="coin" coinId={coin?.id} />
	</div>

	{#if isFetchingCoin}
		<div
			class="flex items-center justify-center mt-6 w-60 h-60 border border-gray-200 bg-gray-100 animate-pulse rounded-full"
		>
			<Spinner />
		</div>
	{:else if coin}
		<div
			style={[
				`transform: scale(${1 + (scale - 5) / 10})`,
				isVertical
					? `margin: ${Math.max(2.3 * (scale - 5), -15)}rem 0`
					: `margin: ${Math.max(1 * (scale - 5), -15)}rem 0`
			]
				.filter(Boolean)
				.join(';')}
			class={clsx('p-4 flex gap-8 mt-4', isVertical ? 'flex-col' : 'flex-row', {
				'grayscale invert bg-white rounded-full': coinColor === 'black',
				'!bg-[#700000]': redeemed && coinColor === 'black',
				redeemed
			})}
		>
			<RoundCodeWithParams id={coin.id} counter={0} color={redeemed ? 'gold' : 'black'} />

			<RoundQR on:click={() => (showControls = !showControls)} />
		</div>

		{#if showControls}
			<div class="text-3xl fixed right-2 bottom-2">
				<div class="flex justify-center items-center gap-2">
					<button on:click={() => (withTime = !withTime)}> T </button>
					<button on:click={() => (isVertical = !isVertical)}>
						{isVertical ? 'H' : 'V'}
					</button>
					<button on:click={() => (withLogo = !withLogo)}> L </button>
					<div class="flex flex-row items-center gap-2">
						<button
							class="rounded border px-2.5 py-1"
							on:click={() => (scale > -3 ? scale-- : null)}
						>
							-
						</button>
						<button
							class="rounded border px-2.5 py-1"
							on:click={() => (scale < 5 ? scale++ : null)}
						>
							+
						</button>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.redeemed.grayscale.invert :global(.coin-counter) {
		fill: white !important;
	}
</style>
