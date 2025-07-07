<script lang="ts">
	import type { CoinModel } from 'src/db/entity/coin';
	import { getIndexUrl } from 'src/shared/routes';

	export let coin: CoinModel | null;

	export let coinUrl: string;

	if (!coinUrl) {
		coinUrl = getComputedUrl();
	}

	export let withTime = false;
	export let withUrl = true;
	export let showUrlEdit = false;

	$: timeFormatMethod = withTime ? ('toLocaleString' as const) : ('toLocaleDateString' as const);
	$: created = new Date(coin?.created_at ?? '')[timeFormatMethod]?.();
	$: now = new Date()[timeFormatMethod]?.();

	if (created === now) {
		withTime = true;
	}

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll('_', ' ');

	function getComputedUrl() {
		console.log('Got it');
		return coin?.id
			? getIndexUrl(`/c/${coin.id}`)
			: `${window.location.origin}${window.location.pathname.split('/').slice(0, -1).join('/')}`;
	}
</script>

{#if coin}
	{#if withUrl && !showUrlEdit}
		<a class="text-lg mt-1" href={coinUrl}>{coinUrl}</a>
	{/if}

	{#if showUrlEdit}
		<input
			class="border border-gray-600 rounded px-3 py-1.5 invalid:border-red-600"
			placeholder="Enter url"
			type="url"
			bind:value={coinUrl}
		/>
	{/if}

	<div class="flex flex-col mb-4 text-sm items-center">
		<span>Created: {created}</span>
		<span>Now: {now}</span>
		<span>{timezone}</span>
	</div>
{/if}
