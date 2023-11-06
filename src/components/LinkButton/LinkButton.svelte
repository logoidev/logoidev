<script lang="ts">
	import type { ButtonSize } from './LinkButton.types';

	let className = '';
	export { className as class };
	export let size: ButtonSize = 'md';

	export let href: string;
	export let text: string;
	export let title = '';

	$: linkClass = [
		'text-xl inline-block border-2 py-2 px-4 rounded border-black hover:bg-slate-200',
		size === 'sm' && `text-sm px-2 py-1`,
		size === 'md' && `text-xl px-3 py-1`,
		size === 'lg' && `text-2xl`,
		className
	]
		.filter(Boolean)
		.join(' ');

	const [pre, post] = text.split('@');
</script>

<a {href} class={linkClass} target="__blank" {title}>
	{#if post}
		{pre}<span class="at">@</span>{post}
	{:else}
		{text}
	{/if}
</a>

<style>
	.at {
		position: relative;
		top: 1.5px;
	}
</style>
