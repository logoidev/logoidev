<script lang="ts">
	const RX = 50;

	let className = '';
	export { className as class };

	export let size: number;
	export let color = 'var(--black)';
	export let rounded = false;

	export let x: number | string;
	export let y: number;
	export let filled = false;
</script>

{#if filled}
	<rect
		class={className}
		fill={color}
		x={typeof x === 'string' ? x : x * size}
		y={y * size}
		rx={rounded ? RX : 0}
		width={size}
		height={size}
	/>
{/if}
