<script lang="ts">
	import { stylesArrayToInline } from 'src/shared/utils';
	import { noop } from 'src/utils/lodash';
	import type { IconName } from '../../static/icons/icons';

	export let title: string;
	export let href = '';
	export let iconName: IconName;
	export let type: 'link' | 'button' = 'link';
	export let target = '__blank';
	export let onClick = noop;
	export let scale = 1;

	let className = '';
	export { className as class };

	let isLink = type === 'link';
	let element = isLink ? 'a' : 'button';

	const elementProps = isLink
		? {
				href,
				target,
				rel: 'noreferrer'
		  }
		: {};

	const getIconPath = (isDynamic: boolean) => {
		const postfix = isDynamic ? 'dynamic.webp' : 'static.svg';
		const path = `/icons/${iconName}/${iconName}-${postfix}`;
		return path;
	};
</script>

<svelte:element
	this={element}
	role="button"
	tabindex="0"
	{...elementProps}
	{title}
	class={`text-xl inline-block my-2 p-2 rounded hover:bg-slate-200 text-center w-fit ${className}`}
	on:click={onClick}
>
	<div
		class={`bg-contain bg-no-repeat w-8 h-8`}
		style={stylesArrayToInline([
			`--scale: ${scale}`,
			`--static-url: url(${getIconPath(false)})`,
			`--dynamic-url: url(${getIconPath(true)})`
		])}
	/>
</svelte:element>

<style>
	div {
		background-image: var(--static-url);
	}

	:hover div,
	:focus-visible div {
		background-image: var(--dynamic-url);
		transform: scale(var(--scale));
	}
</style>
