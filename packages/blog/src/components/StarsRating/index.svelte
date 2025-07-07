<script lang="ts">
	import StarLabel from './StarLabel.svelte';
	import { Level, LEVELS_UPPERCASED, METALS_BY_LEVEL } from './types';

	let currentMetal = 'light-grey';

	const onSelect = (l: Level) => {
		currentMetal = METALS_BY_LEVEL[l];
	};
</script>

<form class="star-rating flex flex-row justify-around text-center">
	{#each LEVELS_UPPERCASED as _, index}
		<StarLabel {onSelect} level={index} color={`var(--${currentMetal})`} />
	{/each}
</form>

<style>
	.star-rating {
		font-size: 1.5em;
		padding: 0 0.2em;
		width: 5em;
	}
</style>
