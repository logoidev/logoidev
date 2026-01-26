<script lang="ts">
	import clsx from 'clsx';
	import { COMPANY_LEGAL_NAME, getFullMainUrl, type LinkReferrer } from '../data/consts';
	import Spacer from './Spacer.svelte';
	import PresenceIndicator from 'src/lib/partykit/PresenceIndicator.svelte';

	let className = '';
	export { className as class };

	export let referrer: LinkReferrer = 'copyright';
	export let withLink = false;
	export let fixed: boolean = false;
	export let coinId = '';

	export let companyName = COMPANY_LEGAL_NAME;
	export let startYear = 2022;
	export let endYear = new Date().getFullYear();

	let showPresenceIndicator = false;

	const COPYRIGHT_SYMBOL = '©';
	const message = `${COPYRIGHT_SYMBOL} ${companyName}`;

	const year = startYear === endYear ? startYear : `${startYear} - ${endYear}`;
</script>

<div
	class={clsx(
		'flex flex-col justify-center items-center text-sm',
		{
			'absolute bottom-0': fixed
		},
		className
	)}
	title="All rights reserved"
>
	<Spacer />
	{#if withLink}
		<a class="underline" href={getFullMainUrl(referrer, coinId)}>{message}</a>
	{:else}
		<button
			class="hover:underline cursor-pointer"
			on:click={() => (showPresenceIndicator = !showPresenceIndicator)}>{message}</button
		>
	{/if}
	<span>{year}</span>
	<Spacer />
</div>

<PresenceIndicator showCount={showPresenceIndicator} />
