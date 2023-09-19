<script lang="ts">
	import { dev } from '$app/environment';
	import { getIndexUrl } from 'src/shared/routes';
	import { noopWithParam } from 'src/utils/lodash';
	import { onMount } from 'svelte';
	import { getQrData, normaliseQrLocalhostUrl, svgToPng, type QrDataResult } from './QrSvg.utils';

	import QrSvgRect from './QrSvgRect.svelte';

	export let url: string;
	export let sizePx: number;
	export let rounded = false;
	export let onButtonSizeUpdate = noopWithParam<string>;
	export let onPngDataUrl = noopWithParam<string | null>;

	let qrData: null | QrDataResult = null;
	let svgElement: SVGElement;
	let widthPx = 0;

	onMount(async () => {
		url = normaliseQrLocalhostUrl(url);
		qrData = getQrData(url);

		if (onPngDataUrl) {
			const pngDataUrl = await svgToPng(svgElement);
			onPngDataUrl(pngDataUrl);
		}

		const size = qrData?.data?.length ?? 0;
		widthPx = sizePx * size;
		const sizePercentage = Math.ceil((qrData.padding / size) * 100);

		onButtonSizeUpdate(`${sizePercentage}%`);
	});
</script>

<svg
	bind:this={svgElement}
	class="w-full h-full"
	width={widthPx}
	height={widthPx}
	viewBox={`0 0 ${widthPx} ${widthPx}`}
>
	{#if qrData?.dataFiltered?.length}
		{#each qrData.dataFiltered as line, y}
			{#each line as value, x}
				<QrSvgRect {x} {y} size={sizePx} {rounded} filled={Boolean(value)} />
			{/each}
		{/each}
	{/if}
</svg>
