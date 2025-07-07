<script lang="ts">
	import { browser } from '$app/environment';
	import { cn } from 'src/lib/utility/cn';

	export let src: string;
	export let alt = 'Unnamed image';
	export let role = 'img';
	export let onClick: undefined | ((e: MouseEvent) => void) = undefined;
	export let scale = 1;
	export let width: number | undefined = undefined;
	export let height: number | undefined = undefined;

	let loaded = false;
	let failed = false;
	let loading = false;

	const loadImage = (src: string) => {
		const img = new Image();
		img.src = src;

		loading = true;

		img.onload = () => {
			loading = false;
			loaded = true;
		};
		img.onerror = () => {
			loading = false;
			failed = true;
		};
	};

	$: browser && loadImage(src);
</script>

{#if loaded}
	{#key src}
		<img
			class={cn([onClick && 'clickable', $$props.class])}
			style="scale: {scale};"
			{role}
			{src}
			{alt}
			{width}
			{height}
			on:click={onClick}
		/>
	{/key}
{:else if failed}
	<span title={alt}>404</span>
{:else if loading}
	<!-- Do not replace with spinner -->
	<img role="progressbar" alt="Loading" src="/images/spinner.svg" />
{/if}

<style>
	img.clickable {
		cursor: pointer;
	}
</style>
