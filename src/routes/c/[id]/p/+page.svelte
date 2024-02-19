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

<div class="flex flex-col touch-manipulation items-center min-w-fit font-serif mt-4">
	{#if isFetchingCoin}
		<div
			class="flex items-center justify-center mt-6 w-60 h-60 border border-gray-200 bg-gray-100 animate-pulse rounded-full"
		>
			<Spinner />
		</div>
	{:else if coin}
		<div
			style={`transform: scale(${1 + (scale - 4) / 10});margin: ${Math.max(2.5 * (scale - 4), -10)}rem 0;`}
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
			<div class="text-3xl fixed right-0 bottom-0">
				<button on:click={() => scale--}>-</button>
				<span>{scale}</span>
				<button on:click={() => scale++}>+</button>
			</div>
		{/if}
	{/if}

	<div class="flex flex-col mt-4 text-center">
		<span>Now: {new Date().toISOString()}</span>
		<span>Created: {coin?.created_at || null}</span>
		<a href={`${ORIGIN}/c/${coinId}`}>{`${ORIGIN}/c/${coinId}`}</a>
		<Copyright withLink referrer="coin" coinId={coin?.id} />
	</div>
</div>

<style>
	.redeemed.grayscale.invert :global(.coin-counter) {
		fill: white !important;
	}
</style>
