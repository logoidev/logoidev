<script lang="ts">
	import LinkButton from './LinkButton/LinkButton.svelte';
	import type { ButtonSize } from './LinkButton/LinkButton.types';

	export let email: string;
	export let subject = '';
	export let body = '';
	export let text = '';
	export let size: ButtonSize = 'md';
	export let title = '';
	export let copyToClipboard = false;
	export let copiedTimeoutMs = 1000;

	let copied = false;

	const getComponent = (key: string, value: string | number | boolean) =>
		`${key}=${encodeURIComponent(value)}`;

	const mailto = [
		`mailto:${email}`,
		(subject || body) && '?',
		subject && getComponent('subject', subject),
		body && getComponent('body', body)
	]
		.filter(Boolean)
		.join('');
</script>

<LinkButton
	class={$$props.class}
	{size}
	{title}
	text={copied ? '✅ Copied' : text || email}
	type={copyToClipboard ? 'button' : 'a'}
	href={mailto}
	on:click={() => {
		navigator.clipboard.writeText(text || email);
		copied = true;
		setTimeout(() => (copied = false), copiedTimeoutMs);
	}}
/>
