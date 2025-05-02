<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUserId } from '$lib/stores/user-data';
	import { onlineUserIds, initializePresenceSocket } from 'src/lib/partykit';

	onMount(() => {
		if (!$currentUserId) {
			return;
		}
		return initializePresenceSocket($currentUserId);
	});
</script>

<span
	class="leading-0 absolute left-2 top-11 z-50 flex w-fit min-w-5 items-center justify-center rounded-full px-1 py-px text-xs"
>
	{$onlineUserIds.size}
</span>
