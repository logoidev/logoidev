<script lang="ts">
	import { stylesArrayToInline } from '../../shared/utils';

	import Image from '../Image.svelte';
	import QrButtons from './QrButtons.svelte';
	import type { QrPassword } from './QrButtons.types';
	import QrSvg from './QrSvg/QrSvg.svelte';
	// import LogoSmallSrc from '@logoi/design/images/logos/logo.svg';
	import { noop, noopWithParam } from 'src/utils/lodash';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let className = '';
	export { className as class };

	export let sizePx = 48;
	export let rounded = false;
	export let animated = false;
	export let url: string;
	export let text = '';
	export let textFontSizePx = sizePx;
	export let textOffset = '0px';
	// TODO: Replace with SVG
	export let img = '/images/logoi-256.png';

	export let onUnlock = noop;
	export let onError = noop;
	export let onLocked = noop;

	export let onPngDataUrl = noopWithParam<string | null>;
	export let password: QrPassword = [];

	let buttonsSizeCss = '';
	const onButtonSizeUpdate = (newQrButtonWidth: string) => {
		buttonsSizeCss = newQrButtonWidth;
	};

	const onCenterClick = () => dispatch('click');
</script>

<div class={`relative m-2 ${className}`}>
	<div class="absolute w-full h-full top-0 left-0 flex justify-center items-center">
		{#if text}
			<button
				id="text"
				on:click={onCenterClick}
				class="cursor-pointer"
				style={stylesArrayToInline([
					`font-size: ${textFontSizePx}px`,
					`height: calc(${textFontSizePx}px + ${textOffset})`
				])}
			>
				{text}
			</button>
		{:else}
			<button id="image" class="w-1/4 cursor-pointer" on:click={onCenterClick}>
				<Image src={img} alt="QR image" />
			</button>
		{/if}
	</div>
	<QrSvg {url} {rounded} {onPngDataUrl} {sizePx} {onButtonSizeUpdate} />
	<QrButtons
		{password}
		{onUnlock}
		{onLocked}
		{onError}
		{rounded}
		{animated}
		sizeCss={buttonsSizeCss}
	/>
</div>

<style>
	#text {
		font-family: 'Trajan Pro', serif;
	}
</style>
