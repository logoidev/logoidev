<script lang="ts">
	import { CALENDAR_LINK } from 'src/shared/constants';
	import LinkButton from './LinkButton/LinkButton.svelte';
	import type { ButtonSize } from './LinkButton/LinkButton.types';

	export let text = 'Book a meeting';
	export let size: ButtonSize = 'lg';
	export let title = 'Schedule a videocall';
	export let href = CALENDAR_LINK;
	export let target: '_blank' | undefined = undefined;
</script>

<LinkButton class="bg-slate-50" {href} {size} {text} {title} {target} />
