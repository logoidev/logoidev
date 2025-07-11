<script lang="ts">
	import { clsx } from 'clsx';
	import type { SocialLink } from '../../types/social-link';

	import IconLink from '../IconLink.svelte';
	import Separator from '../Separator.svelte';
	import SocialLinkElement from './SocialLinkElement.svelte';
	import { SOCIALS } from 'src/data/socials';

	export let socials: Array<SocialLink> = SOCIALS;
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
			/>
		{/if}

		{#if isOpen}
			{#if withSeparators}
				<Separator top={3} />
			{/if}

			<ul class="text-2xl flex flex-wrap items-center justify-center max-w-md mx-10 my-2 px-1">
				{#each socials as social, index}
					<SocialLinkElement
						withLabel={withLabels}
						class={clsx('social-link-element', {
							'social-link-element-last-odd-child':
								index === socials.length - 1 && socials.length % 2 === 1
						})}
						{social}
					/>
				{/each}
			</ul>

			{#if withSeparators}
				<Separator bottom={2} />
			{/if}
		{/if}
	</div>
{/if}

<style>
	@keyframes animate-fade {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	ul {
		animation: animate-fade 0.5s ease;
		height: auto;
	}
</style>
