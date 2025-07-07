<script lang="ts">
	import { getRectsPxFromByteString } from './BinaryLine.utils';
	import { DEFAULT_SIZE_PX } from './RoundCode.consts';

	export let index: number;
	export let byte: string;
	export let sizePx = DEFAULT_SIZE_PX;
	export let angle: number;
	export let translateX: number;
	export let translateY: number;
	export let originX: number;
	export let originY: number;
	export let color = 'black';

	const rects = getRectsPxFromByteString(byte);

	const groupTransformProps = {
		'transform-origin': `${originX} ${originY}`,
		transform: `translate(${translateX}, ${translateY}) rotate(${index * angle})`
	};
</script>

<g {...groupTransformProps}>
	{#each rects as rect}
		<rect
			x={rect.offsetPx}
			y={0}
			width={rect.widthPx}
			height={sizePx}
			rx={Math.round(sizePx / 2)}
			fill={color}
		/>
	{/each}
</g>
