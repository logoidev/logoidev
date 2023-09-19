<script lang="ts">
	import { onMount } from 'svelte';

	let className = '';
	export { className as class };
	export let src: string;
	export let alt = 'Unnamed image';
	export let role = 'img';
	export let onClick: undefined | ((e: MouseEvent) => void) = undefined;

	let loaded = false;
	let failed = false;
	let loading = false;

	const imgClass = [onClick && 'clickable', className].filter(Boolean).join(' ');

	onMount(() => {
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
	});
</script>

{#if loaded}
	<img {role} class={imgClass} {src} {alt} on:click={onClick} />
{:else if failed}
	<span title={alt}>404</span>
{:else if loading}
	<img role="progressbar" src="/images/qr.svg" alt="Loading..." />
{/if}

<style>
	img.clickable {
		cursor: pointer;
	}
</style>
