<script lang="ts">
	import { invertBytes, stringToBytes } from 'src/utils/binary';

	import BinaryLine from './BinaryLine.svelte';
	import { svgToPng } from '../SVG/canvg';

	export let coinId: string;
	export let counter = 0;
	export let bytes = 36;
	export let size = 320;
	export let angle = 360 / bytes;
	export let translateX = 0;
	export let translateY = 160;
	export let originX = 160;
	export let originY = 0;
	export let color = 'black';

	let svgElement: SVGElement;
	let downloadLinkElement: HTMLAnchorElement;

	const padDigit = (digit: number) => (digit < 10 ? `0${digit}` : digit.toString());

	const getTimestamp = () => {
		const now = new Date();
		const date = padDigit(now.getDate());
		const month = padDigit(now.getMonth() + 1);
		const year = padDigit(+now.getFullYear().toString().substring(2));
		return date + month + year;
	};

	const getCombinedByteStrings = (string: string) => {
		const binaryString = stringToBytes(string);
		const invertedBinaryString = invertBytes(binaryString);
		const timestamp = stringToBytes(getTimestamp());
		const combinedByteStrings = [...binaryString, ...timestamp, ...invertedBinaryString];

		return combinedByteStrings.slice(0, bytes);
	};

	let byteStrings = getCombinedByteStrings(coinId);

	const downloadLink = (base64dataUrl: string, fileName: string) => {
		downloadLinkElement.href = base64dataUrl;
		downloadLinkElement.download = `${fileName}.png`;
		downloadLinkElement.click();
	};

	const onClick = async () => {
		const imgDataUrl = await svgToPng(svgElement);
		downloadLink(imgDataUrl, coinId);
	};
</script>

<div class="relative top-1.5">
	{#key angle + translateX + translateY + originX + originY}
		<svg bind:this={svgElement} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
			{#each byteStrings as byte, index}
				<BinaryLine {byte} {index} {angle} {translateX} {translateY} {originX} {originY} {color} />
			{/each}
			{#if counter}
				<text x={150} y={164} class="text-5xl" font-size="20rem">{counter}</text>
			{:else}
				<image
					role="button"
					tabindex="0"
					x="110"
					y="110"
					width="100"
					height="100"
					href="/favicon.svg"
					rx="80"
					on:click={onClick}
					on:keydown={onClick}
				/>
				<div role="presentation" on:click={onClick} on:keydown={onClick}>{counter}</div>
			{/if}
		</svg>
	{/key}
</div>
<a class="absolute hidden" bind:this={downloadLinkElement} href="0" download>Download</a>
