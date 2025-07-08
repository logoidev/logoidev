<script lang="ts">
	import { getSvgParams } from './SVG.utils';

	export let width: number;
	export let height: number;
	export let fill = 'none';

	const params = getSvgParams({ width, height, fill });
</script>

<svg {...params}>
	<slot />
</svg>
