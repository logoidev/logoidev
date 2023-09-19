<script lang="ts">
	import { capitalizeFirst } from 'src/shared/utils';
	import { getFullSocialLink, type FullSocialLink, type SocialLink } from 'src/types/social-link';
	import Image from '../Image.svelte';

	let className = '';
	export { className as class };
	export let social: SocialLink;
	let fullSocial = getFullSocialLink(social);

	let isQrModalOpen = false;

	const onClick = (event: MouseEvent, fullSocial: FullSocialLink) => {
		if (fullSocial.qrImgUrl) {
			isQrModalOpen = true;
			event.preventDefault();
			return;
		}
	};

	const onQrModalBackdropClick = (event: MouseEvent) => {
		const eventTarget = event.target as HTMLElement;
		const isImageClicked = eventTarget.tagName === 'IMG';
		if (!isImageClicked) {
			isQrModalOpen = false;
		}
	};
</script>

<li class={`my-2 flex justify ${className}`}>
	<a
		class="flex pr-2 justify justify-center items-center"
		href={fullSocial.url}
		target="__blank"
		on:click={(e) => onClick(e, fullSocial)}
	>
		{#if fullSocial.image}
			<Image class="w-6 m-2" alt={fullSocial.alt} src={fullSocial.image} />
		{/if}
		<span>{fullSocial.name || capitalizeFirst(fullSocial.type)}</span>
	</a>
</li>

{#if fullSocial.qrImgUrl && isQrModalOpen}
	<div
		class="fixed top-0 left-0 z-10 w-full h-full flex justify-center items-center bg-black bg-opacity-75"
		on:click={onQrModalBackdropClick}
	>
		<div class="w-72">
			<a href={fullSocial.url} target="__blank" title={`Open ${fullSocial.name} social link`}>
				<Image alt="Social QR" src={fullSocial.qrImgUrl} />
			</a>
		</div>
	</div>
{/if}
