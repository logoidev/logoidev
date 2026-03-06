<script lang="ts">
	import clsx from 'clsx';
	import type { SocialLink } from '../../types/social-link';

	import IconLink from '../IconLink.svelte';
	import Separator from '../Separator.svelte';
	import SocialLinkElement from './SocialLinkElement.svelte';

	export let socials: Array<SocialLink> = [];
	export let withSeparators = true;
	export let withToggle = false;
	export let withTitle = false;
	export let withLabels = false;

	let isOpen = !withToggle;
</script>

{#if socials.length !== 0}
	<div class="container flex items-center flex-col">
		{#if withToggle && !isOpen}
			<IconLink
				type="button"
				text={withTitle ? 'Socials' : undefined}
				iconName="globe"
				title="Reveal social links"
				scale={1.2}
				onClick={() => (isOpen = !isOpen)}
				class={$$props.class}
			/>
		{/if}

		{#if isOpen}
			{#if withSeparators}
				<Separator top={3} />
			{/if}

			<ul class="text-2xl flex flex-wrap items-center justify-center max-w-md mx-10 my-2 px-1">
				{#each socials as social}
					<SocialLinkElement withLabel={withLabels} {social} />
				{/each}
			</ul>

			{#if withSeparators}
				<Separator bottom={2} widthPercentage={20} />
			{/if}
		{/if}
	</div>
{/if}
