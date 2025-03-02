<script lang="ts">
	import { goto } from '$app/navigation';
	import Copyright from 'src/components/Copyright.svelte';
	import RoundCodeWithParams from 'src/components/RoundCode/RoundCodeWithParams.svelte';
	import RoundQR from 'src/components/QR/RoundQR/RoundQR.svelte';

	import type { CoinModel } from 'src/db/entity/coin';
	import type { LocationModel } from 'src/db/entity/location';
	import { page } from '$app/stores';

	import Spinner from 'src/components/Spinner.svelte';

	import { getErrorMessage } from 'src/utils/get-error-messge';
	import Header from 'src/components/Header.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import { getIndexUrl } from 'src/shared/routes';
	import { dev } from '$app/environment';
	import CoinInfo from './CoinInfo.svelte';
	import { cn } from 'src/lib/utility/cn';
	import { LOGOI_ID_LENGTH } from 'src/utils/id';

	let coinId = $page.params.id;
	export let isStatic = false;
	export let coin: CoinModel | null = null;
	export let coinQrUrl: string | null = null;
	let qrGraphicSrc: string | undefined = undefined;
	let error: string | '' | 'come_closer' = '';
	let distance: number;
	let destination: LocationModel;
	let showControls = dev;
	let isVertical = true;
	let withLogo = true;
	let withCoinUrl = true;
	let withTimestamps = true;
	let withTime = false;
	let withCopyright = true;
	let withScissors = false;
	let withBorder = true;
	let rounded = true;
	let showCoin = true;
	let showQrCoin = true;
	let showQrCode = false;
	let showUrlEdit = false;
	let showUploadImage = false;

	let emailIndex = 1;
	const CONTACT_EMAILS = ['', 'hi@logoi.dev', 'vlad@logoi.dev'];
	$: email = CONTACT_EMAILS[emailIndex];

	let isFetchingCoin = false;
	let scale = 1;
	// TODO: This in theory is not needed and trips could be infinite
	$: redeemed = coin?.step_index && coin?.step_index >= 3;
	// TODO: This needs not to be based on color

	$: coinColor = coin?.color ?? 'white';
	let coinUrl: string = '';
	$: activeCount = [showCoin, showQrCoin, showQrCode].filter(Boolean).length;
	$: marginMultiplier = (activeCount + 3) * 1;

	let qrGraphicPadding = 2;
	let qrGraphicScale = 1;
	let editCoinId: string | null = coin?.id || null;

	$: {
		console.log('Debug', { coin, coinUrl, coinColor, error, distance, destination, redeemed });
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

	if (!isStatic) {
		fetchCoin(coinId).catch((e) => console.error(e));
	}

	const handleFileChange = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const file = target.files[0];
			const reader = new FileReader();
			reader.onload = () => {
				const base64String = reader.result as string;
				qrGraphicSrc = base64String;
			};
			reader.readAsDataURL(file);
		}
	};
</script>

<div class="flex flex-col touch-manipulation items-center min-w-fit font-serif mb-4">
	<div
		class={cn('flex flex-col mt-2 text-center relative', {
			'border-b-2 border-dashed mb-4': withScissors
		})}
	>
		{#if withLogo}
			<Header />
		{/if}

		<CoinInfo {coin} withUrl={withCoinUrl} bind:withTime bind:coinUrl {showUrlEdit} />

		{#if email}
			<a class="mt-2" href={`mailto:${email}?subject=Help with coin&body=Coin ID: ${coin?.id}`}>
				{email}
			</a>
		{/if}

		{#if withCopyright}
			<Copyright class="!-my-3 scale-75" withLink referrer="coin" coinId={coin?.id} />
		{/if}

		{#if withScissors}
			<div class="absolute left-0 -bottom-4 text-gray-400 text-lg">✄</div>
		{/if}

		{#if showUploadImage}
			<div class="flex gap-2">
				<input
					type="file"
					name="qrImage"
					accept="image/png, image/gif, image/jpeg, image/svg+xml"
					on:change={handleFileChange}
				/>
				<button
					class="border border-gray-400 px-3 py-1 rounded"
					on:click={() => (qrGraphicSrc = '')}
				>
					Clear
				</button>
			</div>

			<label for="qrGraphicScale">Image scale: {qrGraphicScale}</label>
			<input
				name="qrGraphicScale"
				type="range"
				min="0.5"
				max="2"
				step="0.05"
				bind:value={qrGraphicScale}
			/>

			<label for="qrGraphicPadding">Image clear padding: {qrGraphicPadding}</label>
			<input name="qrGraphicPadding" type="range" min="-8" max="10" bind:value={qrGraphicPadding} />
		{/if}
	</div>

	{#if isFetchingCoin}
		<div
			class="flex items-center justify-center mt-6 w-60 h-60 border border-gray-200 bg-gray-100 animate-pulse rounded-full"
		>
			<Spinner />
		</div>
	{:else if coin && activeCount}
		<div
			class={cn('p-4 flex items-center', {
				'flex-col': isVertical,
				'flex-row': !isVertical,
				'!-mt-14': activeCount === 1,
				'mt-2': activeCount !== 1,
				'gap-5': !isVertical,
				redeemed
			})}
			style={[
				`transform: scale(${1 + (scale - 5) / 10})`,
				isVertical
					? `margin-top: ${Math.max(Math.round(2.3 * (scale - marginMultiplier)), -15)}rem`
					: `margin-top: ${Math.max(Math.round(1 * (scale - marginMultiplier)), -15)}rem`
			]
				.filter(Boolean)
				.join(';')}
		>
			{#if showQrCode}
				<div
					class={cn('flex justify-center')}
					style={[
						`transform: scale(${1 + (scale + 7) / 10})`,
						`margin-bottom: ${marginMultiplier + 1}rem`,
						`margin-top: ${marginMultiplier - 1}rem`
					].join(';')}
				>
					<ToggleQr
						class={cn({
							'grayscale invert bg-white': coinColor === 'black'
						})}
						shown
						withToggle={false}
						{qrGraphicSrc}
						{qrGraphicPadding}
						{rounded}
						textOffset="1rem"
						password={[2, 2, 2]}
						on:unlock={() => (showControls = true)}
						on:click={() => (rounded = !rounded)}
						url={coinUrl || ''}
					/>
				</div>
			{/if}

			{#if showCoin}
				{#if showUrlEdit}
					<input
						name="coinId"
						bind:value={editCoinId}
						min="1"
						max={LOGOI_ID_LENGTH}
						placeholder="LGI:C-ABCDEFGH"
						class="border border-gray-400 rounded px-2 py-0.5"
					/>
				{/if}

				<RoundCodeWithParams
					class={cn('mb-4 !p-5 scale-90', {
						'grayscale invert bg-white': coinColor === 'black'
					})}
					id={editCoinId ?? coin.id}
					counter={0}
					color={redeemed ? 'gold' : 'black'}
					{withBorder}
				/>
			{/if}

			{#if showQrCoin}
				{#key coinUrl}
					<RoundQR
						class={cn('my-2 rounded-full', {
							'grayscale invert bg-white border-white': coinColor === 'black'
						})}
						{withBorder}
						{qrGraphicSrc}
						{qrGraphicPadding}
						{qrGraphicScale}
						route={(showUrlEdit ? coinUrl : coinQrUrl) || getIndexUrl(`/c/${coin?.id}`)}
						on:click={() => (showControls = !showControls)}
					/>
				{/key}
			{/if}
		</div>
	{/if}

	{#if showControls}
		<div class="text-3xl fixed right-2 bottom-2">
			<div class="flex flex-wrap-reverse flex-col h-screen justify-end items-center gap-2">
				<button class={cn(!withLogo && 'opacity-50')} on:click={() => (withLogo = !withLogo)}>
					🅖
				</button>
				<button
					class={cn(!withCoinUrl && 'opacity-50')}
					on:click={() => (withCoinUrl = !withCoinUrl)}>🔗</button
				>
				<button
					class={cn(!showUrlEdit && 'opacity-50')}
					on:click={() => (showUrlEdit = !showUrlEdit)}>✏️</button
				>
				<button
					class={cn(!showUploadImage && 'opacity-50')}
					on:click={() => (showUploadImage = !showUploadImage)}>🖼️</button
				>
				<button
					class={cn(!withTimestamps && 'opacity-50')}
					on:click={() => (withTimestamps = !withTimestamps)}>⏰</button
				>
				{#if withTimestamps}
					<button class={cn(!withTime && 'opacity-50')} on:click={() => (withTime = !withTime)}>
						🕐
					</button>
				{/if}
				<button
					class={cn(!emailIndex && 'opacity-50')}
					on:click={() =>
						(emailIndex = emailIndex >= CONTACT_EMAILS.length - 1 ? 0 : emailIndex + 1)}
				>
					@
				</button>
				<button
					class={cn(!withCopyright && 'opacity-50')}
					on:click={() => (withCopyright = !withCopyright)}>©</button
				>
				<button
					class={cn(!withScissors && 'opacity-50')}
					on:click={() => (withScissors = !withScissors)}>✂️</button
				>
				<button class={cn(!showQrCode && 'opacity-50')} on:click={() => (showQrCode = !showQrCode)}
					>👾</button
				>
				<button class={cn(!showCoin && 'opacity-50')} on:click={() => (showCoin = !showCoin)}>
					🪙
				</button>
				<button on:click={() => (showQrCoin = !showQrCoin)}>{showQrCoin ? '⚫' : '⚪'}</button>
				<button on:click={() => (coinColor = coinColor === 'black' ? 'white' : 'black')}>
					🌗
				</button>
				{#if showCoin || showQrCoin}
					<button
						class={cn(!withBorder && 'opacity-50')}
						on:click={() => (withBorder = !withBorder)}
					>
						🔘
					</button>
				{/if}
				<button on:click={() => (isVertical = !isVertical)}>
					{isVertical ? '➡️' : '⬇️'}
				</button>

				<button on:click={() => (scale > -3 ? scale-- : null)}> ➖ </button>
				<button on:click={() => (scale < 5 ? scale++ : null)}> ➕ </button>
				<button class="mt-4" on:click={() => (showControls = false)}>✖️</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.redeemed.grayscale.invert :global(.coin-counter) {
		fill: white !important;
	}

	:global(#image) {
		scale: 1.5;
	}
</style>
