<script lang="ts">
	import LinkButton from './LinkButton/LinkButton.svelte';
	import type { ButtonSize } from './LinkButton/LinkButton.types';
	import { cn } from 'src/lib/utility/cn';

	export let buttonText = 'Contact';
	export let buttonSize: ButtonSize = 'md';
	export let linkClass = '';

	const CONTACT_EMAIL = 'hi@logoi.dev';
	let copied = false;
	let messageTimeout: ReturnType<typeof setTimeout>;
	let displayText = buttonText;
	let copiedOnce = false;

	$: displayText = copiedOnce ? `👋 ${CONTACT_EMAIL}` : buttonText;

	const handleClick = async () => {
		try {
			await navigator.clipboard.writeText(CONTACT_EMAIL);
			copied = true;
			copiedOnce = true;
			// Clear any existing timeout
			if (messageTimeout) {
				clearTimeout(messageTimeout);
			}

			// Hide message after 2 seconds
			messageTimeout = setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy email:', err);
		}
	};
</script>

<div id="contact-button" class={cn('contact-button-wrapper', $$props.class)}>
	<LinkButton
		type="button"
		{buttonSize}
		text={displayText}
		title="Copy contact email to clipboard"
		on:click={handleClick}
		class={linkClass}
	/>
	<div
		class="copied-message text-slate-700 text-center px-3 py-2 bg-slate-50 rounded border border-slate-300 mt-4"
		class:visible={copied}
	>
		Contact email address has been copied
	</div>
</div>

<style>
	.contact-button-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.copied-message {
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 0.3s ease,
			visibility 0.3s ease;
	}

	.copied-message.visible {
		opacity: 1;
		visibility: visible;
	}
</style>
