<script lang="ts">
	import { getIndexUrl } from 'src/shared/routes';
	import { page } from '$app/stores';
	import CoinPrint from 'src/components/CoinPrint.svelte';
	import { COIN_PREFIXES, LOGOI_ID_LENGTH } from 'src/utils/id';

	const path = $page.url.pathname.split('/').slice(0, -1).join('/');

	function getCoinIdFromPath(path: string) {
		const url = path.toUpperCase().replaceAll('/', '').replace('BLOG', '');
		const coinId = `LGI:${COIN_PREFIXES.BLOG}-${url}00000000000`.slice(0, LOGOI_ID_LENGTH);
		return coinId;
	}

	const coinId = getCoinIdFromPath(path);

	$: pageUrl = getIndexUrl(path);
</script>

<CoinPrint
	isStatic
	coinQrUrl={pageUrl}
	coin={{
		id: coinId,
		step_index: 0,
		created_at: new Date('Fri Mar 01 2024 10:00:00 GMT-0500')
	}}
/>
