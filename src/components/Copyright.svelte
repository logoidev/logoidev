<script lang="ts">
	import { COMPANY_LEGAL_NAME, getFullMainUrl, type LinkReferrer } from '../data/consts';
	import Spacer from './Spacer.svelte';
	import Ukraine from './Ukraine.svelte';

	export let referrer: LinkReferrer = 'copyright';
	export let withLink = false;

	const COPYRIGHT_SYMBOL = '©';
	const message = `${COPYRIGHT_SYMBOL} ${COMPANY_LEGAL_NAME}`;

	const START_YEAR = 2022;
	const END_YEAR = new Date().getFullYear();
	const year = START_YEAR === END_YEAR ? START_YEAR : `${START_YEAR} - ${END_YEAR}`;
</script>

<Ukraine />

<div class="flex flex-col justify-center items-center text-sm" title="All rights reserved">
	<Spacer />
	{#if withLink}
		<a class="underline" href={getFullMainUrl(referrer)}>{message}</a>
	{:else}
		<span>{message}</span>
	{/if}
	<span>{year}</span>
	<Spacer />
</div>
