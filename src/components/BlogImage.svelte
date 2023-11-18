<script lang="ts">
	import { clsx } from 'clsx';

	let className = '';
	export { className as class };
	export let imageClass = '';
	export let hide = false;
	export let src: string;
	export let link = '';
	export let title = '';

	$: imgClass = clsx('w-full max-w-2xl', imageClass);
</script>

<p class={clsx('flex flex-col items-center gap-2 mt-2', className, { hidden: hide })}>
	{#if link}
		<a href={link} target="_blank">
			<img class={imgClass} alt={title} {src} />
			<span class="text-center italic block underline">{title}</span>
		</a>
	{:else}
		<img class={imgClass} alt={title} {src} />
		<span class="text-center italic block">{title}</span>
	{/if}
</p>
