<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { cn } from 'src/lib/utility/cn';
	import type { ButtonSize } from './LinkButton.types';

	const dispatch = createEventDispatcher();

	export let size: ButtonSize = 'md';
	export let href: string | undefined = undefined;
	export let text: string;
	export let title = '';
	export let target: '_blank' | undefined = '_blank';
	export let type: 'a' | 'button' = 'a';

	$: linkClass = cn([
		'text-xl inline-block border-2 py-2 px-4 rounded border-black hover:bg-slate-200',
		size === 'sm' && `text-sm px-2 py-1`,
		size === 'md' && `text-xl px-3 py-1`,
		size === 'lg' && `text-2xl`,
		$$props.class
	]);
</script>

<svelte:element
	this={type}
	role={type === 'button' ? 'button' : undefined}
	{target}
	{title}
	{...type === 'a' ? { href } : {}}
	class={linkClass}
	on:click={() => {
		if (type === 'button') {
			dispatch('click');
		}
	}}
>
	{text}
</svelte:element>
