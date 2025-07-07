<script lang="ts">
	import { onMount } from 'svelte';
	import type { BoundingBox } from './types';

	import '../shared/colors.css';
	import { mapValues } from '../../utils/lodash';

	import { stylesArrayToInline, svgTextIdGenerator } from '../../shared/utils';

	// TODO: Make scaling of SVG text work
	// const SCALE = 1;
	const BASE_FONT_SIZE = 32;

	let className = '';
	export { className as class };

	export let id = svgTextIdGenerator.getIndex();
	export let text: string;
	export let size = BASE_FONT_SIZE;
	export let color = 'var(--black)';
	export let hoverColor = 'gray';
	export let noHover = false;

	let width = size;
	let height = size;

	let textStyle = stylesArrayToInline([
		`font-size: ${size}px`,
		`transform: translateY(${height - 4}px)`,
		`--color: ${color}`,
		`--hover-color: ${hoverColor}`,
		noHover ? 'pointer-events: none' : ''
	]);

	onMount(() => {
		const element = document.getElementById(id) as unknown as SVGTextElement;

		if (element) {
			const boundingBox: BoundingBox = element.getBBox();
			const symbolBoundingBox = mapValues(boundingBox, (_, value) => Math.ceil(value));
			width = symbolBoundingBox?.width ?? size;
			height = symbolBoundingBox?.height ?? size;
		}
	});
</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`}>
	<text {id} class={className} style={textStyle}>{text}</text>
</svg>

<style>
	svg text {
		font-family: 'Trajan Pro', serif;
		fill: var(--color);
	}

	svg text:hover {
		fill: var(--hover-color);
	}
</style>
