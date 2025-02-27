<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Image from './Image.svelte';
	import Spinner from './Spinner.svelte';

	export let withTitle = true;
	export let title = 'Design & Development';
	export let greek = false;
	export let noLink = false;
	export let loading = false;
	export let scale = 1;

	const dispatch = createEventDispatcher();

	$: bannerUrl = greek ? '/images/banners/logos-greek.svg' : '/images/logo-big.svg';
</script>

<div class="flex flex-col items-center" style={`scale: ${scale}`}>
	{#if withTitle}
		<button
			class={`text-2xl text-center mt-4 font-trajan`}
			on:click={() => dispatch('title-click')}
		>
			{title}
		</button>
	{/if}

	<div class={`w-2/3 max-w-sm flex justify-center scale-${scale}`}>
		{#if loading}
			<Spinner />
		{:else if noLink}
			<Image src={bannerUrl} />
		{:else}
			<a href="/">
				<Image src={bannerUrl} />
			</a>
		{/if}
	</div>
</div>
