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

	let coinId = $page.params.id;
	let coin: CoinModel | null = null;
	let error: string | '' | 'come_closer' = '';
	let distance: number;
	let destination: LocationModel;
	let showControls = false;

	let isFetchingCoin = false;
	let scale = -2;
	// TODO: This in theory is not needed and trips could be infinite
	$: redeemed = coin?.step_index && coin?.step_index >= 3;
	// TODO: This needs not to be based on color

	$: coinColor = coin?.color ?? 'white';

	$: {
		document.body.style.zoom = `${100 + 10 * scale}%`;
	}

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

<div class="flex flex-col gap-4 touch-manipulation items-center min-w-fit font-serif mt-6">
	{#if isFetchingCoin}
		<div
			class="flex items-center justify-center mt-6 w-60 h-60 border border-gray-200 bg-gray-100 animate-pulse rounded-full"
		>
			<Spinner />
		</div>
	{:else if coin}
		<div
			style={`transform: scale(${1 + scale / 10});margin: ${2.5 * scale}rem 0;`}
			class={clsx('p-4 flex flex-col gap-8', {
				'grayscale invert bg-white rounded-full': coinColor === 'black',
				'!bg-[#700000]': redeemed && coinColor === 'black',
				redeemed
			})}
		>
			<RoundCodeWithParams id={coin.id} counter={0} color={redeemed ? 'gold' : 'black'} />

			<RoundQR on:click={() => (showControls = !showControls)} />
		</div>

		{#if showControls}
			<div class="text-3xl fixed left-0 bottom-0">
				<button on:click={() => scale--}>-</button>
				<span>{scale}</span>
				<button on:click={() => scale++}>+</button>
			</div>
		{/if}
	{/if}

	<div class="flex flex-col mt-5 text-center">
		Date: {new Date().toISOString()}
		<a href={$page.url.pathname}>{`${ORIGIN}${$page.url.pathname}`}</a>
		<Copyright withLink referrer="coin" coinId={coin?.id} />
	</div>
</div>

<style>
	.redeemed.grayscale.invert :global(.coin-counter) {
		fill: white !important;
	}
</style>
