<script lang="ts">
	import { CALENDAR_LINK } from 'src/shared/constants';
	import LinkButton from './LinkButton/LinkButton.svelte';
	import type { ButtonSize } from './LinkButton/LinkButton.types';

	export let text = 'Book a meeting';
	export let size: ButtonSize = 'lg';
</script>

<LinkButton class="bg-slate-50" href={CALENDAR_LINK} {size} {text} />
