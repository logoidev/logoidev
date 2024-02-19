<script lang="ts">
	import { onMount } from 'svelte';

	import Image from './Image.svelte';
	import QR from './QR/QR.svelte';
	import { noop, noopWithParam } from 'src/utils/lodash';
	import type { QrPasswordNumber } from './QR/QrButtons.types';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let shown = false;
	export let url: string;
	export let imageSrc: string | undefined = undefined;
	export let unlockImageSrc: string | undefined = undefined;
	export let text = '';
	export let textFontSizePx: undefined | number = undefined;
	export let textOffset: undefined | string = undefined;
	export let rounded = false;
	export let animated = false;
	export let password = [] as Array<QrPasswordNumber>;
	export let onUnlock = noop;
	export let onPngDataUrl = noopWithParam<string | null>;
	export let isUnlocked = false;
	export let withToggle = true;

	let qrCodeSource = isUnlocked ? unlockImageSrc : imageSrc;

	let qrWrapperElement: HTMLDivElement;
	let buttonElement: HTMLButtonElement;

	let isQrShown: boolean;
	const onToggleQrShown = () => {
		isQrShown = !isQrShown;

		setTimeout(() => {
			const element = isQrShown ? qrWrapperElement : buttonElement;
			element.scrollIntoView({
				behavior: 'smooth'
			});
		}, 50);
	};

	onMount(() => (isQrShown = shown));
</script>

{#if withToggle}
	<button
		bind:this={buttonElement}
		title={isQrShown ? 'Hide' : 'Show'}
		class="text-xl flex items-center justify-between w-max m-4 border-2 p-2 rounded border-black hover:bg-slate-200"
		on:click={onToggleQrShown}
	>
		<Image class="w-8" src="/images/qr-small.svg" />
	</button>
{/if}

{#if isQrShown}
	<div bind:this={qrWrapperElement} class="w-2/3 max-w-xs flex justify-center relative">
		{#if isUnlocked && qrCodeSource}
			<Image class="mt-4" src={qrCodeSource} />
		{:else}
			<QR
				{password}
				{url}
				{text}
				{textFontSizePx}
				{textOffset}
				{rounded}
				{animated}
				{onPngDataUrl}
				on:click={() => dispatch('click')}
				onUnlock={() => {
					isUnlocked = true;
					password = [];
					onUnlock();
				}}
				onError={() => (isUnlocked = false)}
			/>{/if}
	</div>
{/if}
