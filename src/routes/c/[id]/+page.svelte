<script lang="ts">
	import { nanoid } from 'src/utils/nanoid';

	import Header from '../../../components/Header.svelte';
	// import Copyright from '../../../components/Copyright.svelte';
	import RoundCodeWithParams from '../../../components/RoundCode/RoundCodeWithParams.svelte';
	// import RoundQR from '../../../components/QR/RoundQR/RoundQR.svelte';
	import { Storage } from 'src/utils/storage';
	import type { Coin } from './types';

	const COIN = 'LGI';

	const makeId = (prefix: string, id: string) => `${prefix}:${id}`;

	const wallet = new Storage<Record<string, Coin>>('logoi_wallet');

	let id = window.location.hash?.slice(1);
	if (!id) {
		id = makeId(COIN, nanoid());
		window.location.hash = id;
		if (wallet.value) {
			wallet.value[id] = { id, type: 'LGI', amount: 0, color: 'white' };
		}
	}
</script>

<div class="flex flex-col touch-manipulation items-center min-w-fit font-serif h-screen mt-12">
	<Header />

	<RoundCodeWithParams {id} />

	<br />

	<!-- <RoundQR /> -->

	<!-- <Copyright /> -->
</div>
