<script lang="ts">
	import { stylesArrayToInline } from 'src/shared/utils';

	export let top = 1;
	export let bottom = 1;
	export let widthPercentage = 33;

	const STEP_PX = 4;

	const getPixels = (steps: number) => `${steps * STEP_PX}px`;

	$: inlineStyleString = stylesArrayToInline([
		`width: ${widthPercentage}%`,
		...(top === bottom
			? [`margin: ${getPixels(top)} 0`]
			: [`margin-top: ${getPixels(top)}`, `margin-bottom: ${getPixels(bottom)}`])
	]);
</script>

<div role="separator" class="h-px bg-slate-300" style={inlineStyleString}>&nbsp;</div>

<style>
	@keyframes animate {
		0% {
			transform: scaleX(0);
		}
		100% {
			transform: scaleX(1);
		}
	}
	div {
		animation: animate 1s ease;
	}
</style>
