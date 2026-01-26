<script lang="ts">
	import LinkButton from './LinkButton/LinkButton.svelte';
	import type { ButtonSize } from './LinkButton/LinkButton.types';
	import { createEventDispatcher } from 'svelte';
	import { cn } from 'src/lib/utility/cn';

	const dispatch = createEventDispatcher();

	export let buttonText = 'Contact';
	export let buttonSize: ButtonSize = 'md';
	export let isExpanded = false;
	export let linkClass = '';

	const handleClick = () => {
		dispatch('click');
	};
</script>

<div
	id="contact-button"
	class={cn('contact-button-wrapper', $$props.class)}
	class:faded={isExpanded}
>
	<LinkButton
		type="button"
		{buttonSize}
		text={buttonText}
		title="Open contact form"
		on:click={handleClick}
		class={linkClass}
	/>
</div>

<style>
	.contact-button-wrapper {
		opacity: 1;
		transform: scale(1);
		transition:
			opacity 0.3s ease,
			transform 0.3s ease,
			visibility 0.3s ease;
		visibility: visible;
		pointer-events: auto;
	}

	.contact-button-wrapper.faded {
		opacity: 0;
		transform: scale(0.95);
		visibility: hidden;
		pointer-events: none;
	}
</style>
