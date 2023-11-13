<script lang="ts">
	import Image from './Image.svelte';
	import Spinner from './Spinner.svelte';

	export let withTitle = true;
	export let title = 'Design & Development';
	export let greek = false;
	export let noLink = false;
	export let loading = false;

	$: bannerUrl = greek ? './images/banners/logos-greek.svg' : './images/logo-big.svg';
</script>

{#if withTitle}
	<span class="text-3xl text-center mt-4">{title}</span>
{/if}

<div class="w-2/3 max-w-sm flex justify-center">
	{#if loading}
		<Spinner />
	{:else if noLink}
		<Image src={bannerUrl} />
	{:else}
		<a href="#">
			<Image src={bannerUrl} />
		</a>
	{/if}
</div>
