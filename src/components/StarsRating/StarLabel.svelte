<script lang="ts">
	import SvgText from './SvgText.svelte';

	import { Level, LEVELS_UPPERCASED, METALS_BY_LEVEL, POSITION_TYPES_BY_LEVEL } from './types';

	import { capitalizeFirst, stylesArrayToInline } from '../../shared/utils';

	const INITIAL_COLOR = 'var(--light-grey)';

	let className = '';
	export { className as class };

	export let level: Level;
	export let onSelect: null | ((l: Level) => void | Level) = null;
	export let color: string = INITIAL_COLOR;

	const levelSymbol = LEVELS_UPPERCASED[level];
	const metal = METALS_BY_LEVEL[level];
	const positionType = POSITION_TYPES_BY_LEVEL[level];
	const positionTitle = capitalizeFirst(positionType);
	const title = `${levelSymbol} - ${positionTitle}`;
	const labelStyle = stylesArrayToInline([levelSymbol ? 'cursor:pointer' : '']);
	const metalColor = `var(--${metal})`;

	console.log('L', level, metal, color);

	const onRatingChange = (e: Event) => {
		if (onSelect) {
			const target = e.target as HTMLInputElement;
			onSelect(Number(target.value));
		}
	};
</script>

{#if onSelect}
	<input
		class="hidden"
		name="rating"
		type="radio"
		id={levelSymbol}
		value={level}
		on:change={onRatingChange}
	/>
	<label for={levelSymbol ?? ''} class="star" style={labelStyle} {title}>
		<SvgText {color} class={`metal ${metal}`} text={levelSymbol} hoverColor={metalColor} />
	</label>
{:else}
	<div class={`star ${className}`} {title}>
		<SvgText class={`metal ${metal}`} text={levelSymbol} color={metalColor} noHover />
	</div>
{/if}
