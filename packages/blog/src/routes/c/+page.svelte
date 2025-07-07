<script lang="ts">
	import { goto } from '$app/navigation';
	import Spinner from 'src/components/Spinner.svelte';

	import type { CoinModel } from 'src/db/entity/coin';

	const fetchMakeNewCoin = async () => {
		const response = await fetch('/c');
		const json = await response.json();
		return json as CoinModel;
	};

	fetchMakeNewCoin().then((c) => (c.id ? goto(`/c/${c.id}`) : null));
</script>

<div class="w-screen h-screen flex justify-center items-center">
	<Spinner />
</div>
