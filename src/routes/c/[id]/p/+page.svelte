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
	import Header from 'src/components/Header.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import { getIndexUrl } from 'src/shared/routes';

	let coinId = $page.params.id;
	let coin: CoinModel | null = null;
	let error: string | '' | 'come_closer' = '';
	let distance: number;
	let destination: LocationModel;
	let showControls = true;
	let isVertical = true;
	let withLogo = true;
	let withTime = false;
	let withBorder = true;
	let withScissors = true;
	let isCoin = true;
	let rounded = true;
	let showCoin = true;
	let showQrCoin = true;
	let showQrCode = false;

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
	$: coinUrl = coin?.id ? getIndexUrl(`/c/${coin.id}`) : null;
	$: marginMultiplier = ([showCoin, showQrCoin, showQrCode].filter(Boolean).length + 3) * 1;

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

<div class="flex flex-col touch-manipulation items-center min-w-fit font-serif mb-4">
	<div
		class={clsx('flex flex-col mt-2 text-center relative', {
			'border-b-2 border-dashed mb-4': withScissors
		})}
	>
		{#if withLogo}
			<Header />
		{/if}
		<a class="text-lg mt-1" href={coinUrl}>{coinUrl}</a>
		{#if !isFetchingCoin}
			<div class="flex flex-col text-sm">
				<span>Created: {created}</span>
				<span>Now: {now}</span>
				<span>{timezone}</span>
			</div>
		{/if}
		<a class="mt-2" href={`mailto:hi@logoi.dev?subject=Help with coin&body=Coin ID: ${coin?.id}`}>
			hi@logoi.dev
		</a>
		<Copyright class="!-mt-2" withLink referrer="coin" coinId={coin?.id} />

		{#if withScissors}
			<div class="absolute left-0 -bottom-4 text-gray-400 text-lg">✄</div>
		{/if}
	</div>

	{#if isFetchingCoin}
		<div
			class="flex items-center justify-center mt-6 w-60 h-60 border border-gray-200 bg-gray-100 animate-pulse rounded-full"
		>
			<Spinner />
		</div>
	{:else if coin}
		<div
			class={clsx('p-4 flex items-center *:gap-8 mt-4', isVertical ? 'flex-col' : 'flex-row', {
				'grayscale invert bg-white rounded-full': coinColor === 'black',
				'!bg-[#700000]': redeemed && coinColor === 'black',
				redeemed
			})}
			style={[
				`transform: scale(${1 + (scale - 5) / 10})`,
				isCoin
					? isVertical
						? `margin-top: ${Math.max(Math.round(2.3 * (scale - marginMultiplier)), -15)}rem`
						: `margin-top: ${Math.max(Math.round(1 * (scale - marginMultiplier)), -15)}rem`
					: ''
			]
				.filter(Boolean)
				.join(';')}
		>
			{#if showCoin}
				<RoundCodeWithParams
					class="mb-4"
					id={coin.id}
					counter={0}
					color={redeemed ? 'gold' : 'black'}
					{withBorder}
				/>
			{/if}

			{#if showQrCoin}
				<RoundQR
					class="my-2"
					{withBorder}
					route={getIndexUrl(`/c/${coin?.id}`)}
					on:click={() => (showControls = !showControls)}
				/>
			{/if}

			{#if showQrCode}
				<div
					class="flex justify-center"
					style={[
						`transform: scale(${1 + (scale + 7) / 10})`,
						`margin-top: ${marginMultiplier}rem`
					].join(';')}
				>
					<ToggleQr
						shown
						withToggle={false}
						{rounded}
						textOffset="1rem"
						password={[2, 2, 2]}
						on:unlock={() => (showControls = true)}
						on:click={() => (rounded = !rounded)}
						url={coinUrl}
					/>
				</div>
			{/if}
		</div>
	{/if}

	{#if showControls}
		<div class="text-3xl fixed right-2 bottom-2">
			<div class="flex justify-center items-center gap-2">
				<button on:click={() => (showCoin = !showCoin)}>🪙</button>
				<button on:click={() => (showQrCoin = !showQrCoin)}>{showQrCoin ? '⚫' : '⚪'}</button>
				<button on:click={() => (showQrCode = !showQrCode)}>👾</button>
				<button on:click={() => (withScissors = !withScissors)}>✂️</button>
				<button on:click={() => (withTime = !withTime)}>🕐</button>
				<button class={isCoin ? '' : 'hidden'} on:click={() => (withBorder = !withBorder)}>
					🔘
				</button>
				<button class={isCoin ? '' : 'hidden'} on:click={() => (isVertical = !isVertical)}>
					{isVertical ? '➡️' : '⬇️'}
				</button>
				<button on:click={() => (withLogo = !withLogo)}>©</button>
				<button on:click={() => (scale > -3 ? scale-- : null)}> ➖ </button>
				<button on:click={() => (scale < 5 ? scale++ : null)}> ➕ </button>
				<button class="ml-4" on:click={() => (showControls = false)}>✖️</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.redeemed.grayscale.invert :global(.coin-counter) {
		fill: white !important;
	}
</style>
