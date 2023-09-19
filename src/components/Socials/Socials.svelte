<script lang="ts">
	import { classArrayToInline } from 'src/shared/utils';
	import type { SocialLink } from '../../types/social-link';

	import IconLink from '../IconLink.svelte';
	import Separator from '../Separator.svelte';
	import SocialLinkElement from './SocialLinkElement.svelte';

	export let socials: Array<SocialLink> = [];
	export let withSeparators = true;
	export let withToggle = false;

	let isOpen = !withToggle;
</script>

{#if socials.length !== 0}
	<div class="container flex items-center flex-col">
		{#if withToggle && !isOpen}
			<IconLink
				type="button"
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

			<ul class="text-2xl flex flex-wrap items-stretch justify-between max-w-md mx-10 my-2 px-1">
				{#each socials as social, index}
					<SocialLinkElement
						class={classArrayToInline([
							'social-link-element',
							index === socials.length - 1 && socials.length % 2 === 1
								? 'social-link-element-last-odd-child'
								: ''
						])}
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
		overflow: hidden;
	}

	/* TODO: Replace with tailwind notation */
	@media only screen and (max-width: 495px) {
		ul :global(.social-link-element) {
			width: 50%;
			justify-content: space-around;
		}

		ul :global(.social-link-element-last-odd-child) {
			width: 100%;
		}
	}
	@media only screen and (max-width: 360px) {
		ul {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
