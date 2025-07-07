<script lang="ts">
	import { onMount } from 'svelte';
	import { initializePresenceSocket, onlineUserIds } from './modules/presence';
	import { currentUserId, isAdmin } from '$lib/stores/user-data';
	import { WITH_PARTYKIT } from './partykit.constants';
	import { cn } from '../utility/cn';
	import { initializeNotificationsSocket } from './modules';

	export let showCount = false;

	let confetti = () => {};
	let letsParty = () => {};

	$: ENABLED = $isAdmin && showCount;

	async function prepareConfetti() {
		const confettiModule = await import('canvas-confetti');
		confetti = () =>
			confettiModule.default({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.7 }
			});
	}

	onMount(() => {
		if (!$currentUserId) {
			return;
		}

		if (WITH_PARTYKIT) {
			prepareConfetti();
		}

		if (!WITH_PARTYKIT) {
			if (import.meta.env.DEV) {
				console.warn('PartyKit is disabled, run with `pnpm dev:partykit` to enable');
			}
			return;
		}

		const presenceSocket = initializePresenceSocket($currentUserId);
		const notificationsSocket = initializeNotificationsSocket($currentUserId);

		notificationsSocket.on('notifications-broadcast', (payload) => {
			console.log('Got notification', payload);
			confetti();
		});

		letsParty = () => {
			notificationsSocket.send('notify', {
				message: "Let's party",
				title: '🥳'
			});
		};

		return () => {
			presenceSocket?.close();
			notificationsSocket?.close();
		};
	});
</script>

{#if ENABLED}
	<button
		title="Visible only to admins"
		class={cn('fixed right-4 bottom-4 z-50', $$props.class)}
		on:click={() => letsParty()}
	>
		{WITH_PARTYKIT ? `${$onlineUserIds.size} 🥳` : '🎉❌'}
	</button>
{/if}
