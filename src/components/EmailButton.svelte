<script lang="ts">
	import LinkButton from './LinkButton/LinkButton.svelte';
	import type { ButtonSize } from './LinkButton/LinkButton.types';

	export let email: string;
	export let subject = '';
	export let body = '';
	export let text = '';
	export let size: ButtonSize = 'md';
	export let title = '';

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

<LinkButton class={$$props.class} href={mailto} text={text || email} {size} {title} />
