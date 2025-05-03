<script lang="ts">
	import { onMount } from 'svelte';
	import { initializePresenceSocket, onlineUserIds } from './modules/presence';
	import { currentUserId, isAdmin } from '$lib/stores/user-data';
	import { WITH_PARTYKIT } from './partykit.constants';
	import { cn } from '../utility/cn';

	export let showCount = false;

	onMount(() => {
		if (!$currentUserId) {
			return;
		}

		if (!WITH_PARTYKIT) {
			if (import.meta.env.DEV) {
				console.warn('PartyKit is disabled, run with `pnpm dev:partykit` to enable');
			}
			return;
		}

		return initializePresenceSocket($currentUserId);
	});
</script>

{#if $isAdmin && showCount}
	<span title="Visible only to admins" class={cn('fixed right-4 bottom-4 z-50', $$props.class)}>
		{WITH_PARTYKIT ? `${$onlineUserIds.size} 🥳` : '🎉❌'}
	</span>
{/if}
