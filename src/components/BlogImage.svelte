<script lang="ts">
	import Image from './Image.svelte';
	import { cn } from 'src/lib/utility/cn';

	export let imageClass = '';
	export let description: string = '';
	export let hide = false;
	export let src: string;
	export let link = '';
	export let title = '';

	$: imgClass = cn('w-full max-w-2xl', imageClass);
</script>

<p class={cn('flex flex-col items-center gap-2 mt-2', $$props.class)}>
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
