import PartySocket from 'partysocket';
import { get, writable } from 'svelte/store';
import { currentUserId } from '$lib/stores/user-data';
import type { PartyKitMessage } from '$lib/../../party';
import { PARTYKIT_HOST } from './constants';

export const onlineUserIds = writable(new Set<string>());

let socket: PartySocket;

export const initializePresenceSocket = (userId: string) => {
	if (!userId) {
		console.error('No user id in PartyKit socket');
		return;
	}
	socket = new PartySocket({
		host: PARTYKIT_HOST,
		room: 'default',
		party: 'presence',
		id: userId
	});
	console.log('Initialized');

	// Send user info when connected
	socket.addEventListener('open', () => {
		console.log('Socket open');
		socket.send(
			JSON.stringify({
				type: 'add-user',
				payload: userId
			})
		);
	});

	// Handle presence updates
	socket.addEventListener('message', (event) => {
		console.log('Socket message', event);
		const message = JSON.parse(event.data) as PartyKitMessage;
		if (message.type === 'presence-update') {
			onlineUserIds.set(new Set(message.payload.userIds));
		}
	});

	return () => {
		if (socket) {
			const userId = get(currentUserId);
			if (!userId) {
				return;
			}

			console.log('Removing user', userId);
			socket.send(
				JSON.stringify({
					type: 'remove-user',
					payload: userId
				})
			);
			socket.close();
		}
	};
};
