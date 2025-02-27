<script lang="ts">
	import { cn } from 'src/lib/utility/cn';
	import type { ButtonSize } from './LinkButton.types';

	export let size: ButtonSize = 'md';

	export let href: string;
	export let text: string;
	export let title = '';
	export let target: '_blank' | undefined = '_blank';

	$: linkClass = cn([
		'text-xl inline-block border-2 py-2 px-4 rounded border-black hover:bg-slate-200',
		size === 'sm' && `text-sm px-2 py-1`,
		size === 'md' && `text-xl px-3 py-1`,
		size === 'lg' && `text-2xl`,
		$$props.class
	]);

	const [pre, post] = text.split('@');
</script>

<a {href} class={linkClass} {target} {title}>
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
