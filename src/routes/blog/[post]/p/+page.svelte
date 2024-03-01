<script lang="ts">
	import { getIndexUrl } from 'src/shared/routes';
	import { page } from '$app/stores';
	import CoinPrint from 'src/components/CoinPrint.svelte';

	const path = $page.url.pathname.split('/').slice(0, -1).join('/');

	$: pageUrl = getIndexUrl(path);
</script>

<CoinPrint
	isStatic
	coinQrUrl={pageUrl}
	coin={{
		id: 'LGI:JORDANBPETE',
		step_index: 0,
		created_at: new Date('Fri Mar 01 2024 10:00:00 GMT-0500')
	}}
/>
