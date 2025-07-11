<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Image from './Image.svelte';
	import Spinner from './Spinner.svelte';
	import { cn } from 'src/lib/utility/cn';

	export let withTitle = true;
	export let title = 'Development';
	export let greek = false;
	export let noLink = false;
	export let loading = false;
	export let scale = 1;

	const dispatch = createEventDispatcher();

	$: bannerUrl = greek ? '/images/banners/logos-greek.svg' : '/images/logo-big.svg';
</script>

<div class={cn('flex flex-col items-center', $$props.class)} style={`scale: ${scale}`}>
	{#if withTitle}
		<button
			class={cn('text-2xl text-center mt-4 font-trajan', $$props.class)}
			on:click={() => dispatch('title-click')}
		>
			{title}
		</button>
	{/if}

	<div class={`w-2/3 max-w-sm flex justify-center scale-${scale}`}>
		{#if loading}
			<Spinner />
		{:else if noLink}
			<Image src={bannerUrl} width={360} height={120} alt="Logoi" />
		{:else}
			<a href="/">
				<Image src={bannerUrl} width={360} height={120} alt="Logoi" />
			</a>
		{/if}
	</div>
</div>
