<script lang="ts">
	import { invertBytes, stringToBytes } from 'src/utils/binary';
	import { nanoid } from 'src/utils/nanoid';

	import BinaryLine from './BinaryLine.svelte';
	import { svgToPng } from '../SVG/canvg';

	export let bytes = 36;
	export let size = 320;
	export let angle = 360 / bytes;
	export let translateX = 0;
	export let translateY = 160;
	export let originX = 160;
	export let originY = 0;
	export let withImage = true;

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

	const makeId = (prefix: string, id: string) => `${prefix}:${id}`;
	const COIN = 'LGI';

	let id = window.location.hash?.slice(1);
	if (!id) {
		id = makeId(COIN, nanoid());
		window.location.hash = id;
	}

	let byteStrings = getCombinedByteStrings(id);

	const downloadLink = (base64dataUrl: string, fileName: string) => {
		downloadLinkElement.href = base64dataUrl;
		downloadLinkElement.download = `${fileName}.png`;
		downloadLinkElement.click();
	};
</script>

<div>
	{#key angle + translateX + translateY + originX + originY}
		<svg bind:this={svgElement} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
			{#each byteStrings as byte, index}
				<BinaryLine {byte} {index} {angle} {translateX} {translateY} {originX} {originY} />
			{/each}
			{#if withImage}
				<image
					x="110"
					y="110"
					width="100"
					height="100"
					href="/favicon.svg"
					rx="80"
					on:click={async () => {
						const imgDataUrl = await svgToPng(svgElement);
						downloadLink(imgDataUrl, id);
					}}
				/>
			{/if}
		</svg>
	{/key}

	<a class="absolute hidden" bind:this={downloadLinkElement} href="0" download>Download</a>
</div>