<script lang="ts">
	import type { CoinModel } from 'src/db/entity/coin';
	import { getIndexUrl } from 'src/shared/routes';

	export let coin: CoinModel | null;
	$: computedCoinUrl = coin?.id
		? getIndexUrl(`/c/${coin.id}`)
		: `${window.location.origin}${window.location.pathname.split('/').slice(0, -1).join('/')}`;
	$: coinUrl = computedCoinUrl;
	export let withTime = false;
	export let withUrl = true;
	$: timeFormatMethod = withTime ? ('toLocaleString' as const) : ('toLocaleDateString' as const);
	$: created = new Date(coin?.created_at ?? '')[timeFormatMethod]?.();
	$: now = new Date()[timeFormatMethod]?.();

	if (created === now) {
		withTime = true;
	}

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll('_', ' ');
</script>

{#if coin}
	{#if withUrl}
		<a class="text-lg mt-1" href={coinUrl}>{coinUrl}</a>
	{/if}

	<div class="flex flex-col mb-4 text-sm items-center">
		<span>Created: {created}</span>
		<span>Now: {now}</span>
		<span>{timezone}</span>
	</div>
{/if}
