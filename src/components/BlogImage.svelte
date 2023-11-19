<script lang="ts">
	import { clsx } from 'clsx';
	import Image from './Image.svelte';

	let className = '';
	export { className as class };
	export let imageClass = '';
	export let description: string = '';
	export let hide = false;
	export let src: string;
	export let link = '';
	export let title = '';

	$: imgClass = clsx('w-full max-w-2xl', imageClass);
</script>

<p class={clsx('flex flex-col items-center gap-2 mt-2', className)}>
	{#if hide}
		<button class="text-sm opacity-50 hover:opacity-90" on:click={() => (hide = !hide)}>
			{title}
		</button>
	{:else}
		{#if link}
			<a href={link} target="_blank" class="flex flex-col items-center gap-2">
				<Image class={imgClass} alt={title} {src} />
				<span class="text-center italic block underline">{title}</span>
			</a>
		{:else}
			<Image class={imgClass} alt={title} {src} />
			<span class="text-center italic block">{title}</span>
		{/if}

		{#if description}
			<span class="text-base italic text-center opacity-50">{description}</span>
		{/if}
	{/if}
</p>
