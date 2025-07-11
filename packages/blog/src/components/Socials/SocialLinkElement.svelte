<script lang="ts">
	import { capitalizeFirst } from 'src/shared/utils';
	import { getFullSocialLink, type FullSocialLink, type SocialLink } from 'src/types/social-link';
	import Image from '../Image.svelte';
	import { cn } from 'src/lib/utility/cn';

	export let social: SocialLink;
	export let withLabel = true;

	let fullSocial = getFullSocialLink(social);

	let isQrModalOpen = false;

	const onClick = (event: MouseEvent, fullSocial: FullSocialLink) => {
		if (fullSocial.qrImgUrl) {
			isQrModalOpen = true;
			event.preventDefault();
			return;
		}
	};

	const onQrModalBackdropClick = (event: MouseEvent | KeyboardEvent) => {
		const eventTarget = event.target as HTMLElement;
		const isImageClicked = eventTarget.tagName === 'IMG';
		if (!isImageClicked) {
			isQrModalOpen = false;
		}
	};
</script>

<li class={cn(`my-2 flex justify`, $$props.class)} title={fullSocial.name}>
	<a
		class="flex mx-1 justify justify-center items-center"
		href={fullSocial.url}
		target="__blank"
		on:click={(e) => onClick(e, fullSocial)}
	>
		{#if fullSocial.image}
			<Image class="w-6 m-2" alt={fullSocial.alt} src={fullSocial.image} />
		{/if}
		{#if withLabel}
			<span>{fullSocial.name || capitalizeFirst(fullSocial.type)}</span>
		{/if}
	</a>
</li>

{#if fullSocial.qrImgUrl && isQrModalOpen}
	<div
		role="link"
		tabindex="0"
		class="fixed top-0 left-0 z-10 w-full h-full flex justify-center items-center bg-black bg-opacity-75"
		on:click={onQrModalBackdropClick}
		on:keydown={onQrModalBackdropClick}
	>
		<div class="w-72">
			<a href={fullSocial.url} target="__blank" title={`Open ${fullSocial.name} social link`}>
				<Image alt="Social QR" src={fullSocial.qrImgUrl} />
			</a>
		</div>
	</div>
{/if}
