<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUserId } from '$lib/stores/user-data';
	import { onlineUserIds, initializePresenceSocket } from 'src/lib/partykit';
	// import type StarryOverlayType from './StarryOverlay.svelte';

	// // Lazy-loaded component
	// let StarryOverlay: typeof StarryOverlayType;
	// let showStars = false;

	export let showCount = false;

	onMount(() => {
		if (!$currentUserId) {
			return;
		}

		const cleanup = initializePresenceSocket($currentUserId);

		// import('./StarryOverlay.svelte').then((module) => {
		// 	StarryOverlay = module.default;
		// 	showStars = true;
		// });

		return cleanup;
	});
</script>

<!-- {#if showStars && StarryOverlay && $onlineUserIds.size}
	<svelte:component this={StarryOverlay} starCount={$onlineUserIds.size} />
{/if} -->

{#if showCount}
	<span class={$$props.class}>
		{$onlineUserIds.size}
	</span>
{/if}
