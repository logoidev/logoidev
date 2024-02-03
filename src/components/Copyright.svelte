<script lang="ts">
	import clsx from 'clsx';
	import { COMPANY_LEGAL_NAME, getFullMainUrl, type LinkReferrer } from '../data/consts';
	import Spacer from './Spacer.svelte';
	import Ukraine from './Ukraine.svelte';

	export let referrer: LinkReferrer = 'copyright';
	export let withLink = false;
	export let fixed: boolean = false;

	export let companyName = COMPANY_LEGAL_NAME;
	export let startYear = 2022;
	export let endYear = new Date().getFullYear();

	const COPYRIGHT_SYMBOL = '©';
	const message = `${COPYRIGHT_SYMBOL} ${companyName}`;

	const year = startYear === endYear ? startYear : `${startYear} - ${endYear}`;
</script>

<Ukraine />

<div
	class={clsx('flex flex-col justify-center items-center text-sm', {
		'absolute bottom-0': fixed
	})}
	title="All rights reserved"
>
	<Spacer />
	{#if withLink}
		<a class="underline" href={getFullMainUrl(referrer)}>{message}</a>
	{:else}
		<span>{message}</span>
	{/if}
	<span>{year}</span>
	<Spacer />
</div>
