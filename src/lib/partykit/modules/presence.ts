import PartySocket from 'partysocket';
import { get, writable } from 'svelte/store';
import { currentUserId } from '$lib/stores/user-data';

import { PARTYKIT_HOST, WITH_PARTYKIT } from '../partykit.constants';
import { makeLog } from '../partykit.utils';
import { presenceMessageSchema, type PresenceMessage } from 'party/presence.schema';

const log = makeLog('[presence]');

export const onlineUserIds = writable(new Set<string>());

let presenceSocket: PartySocket | null = null;

export const initializePresenceSocket = (userId: string) => {
	if (!WITH_PARTYKIT) {
		console.warn('PartyKit is disabled, run with `pnpm dev:partykit` to enable');
		return;
	}

	if (!userId) {
		log('No user id in PartyKit socket');
		return;
	}

	presenceSocket = new PartySocket({
		host: PARTYKIT_HOST,
		room: 'main',
		party: 'presence',
		id: userId
	});
	log('PartyKit initialized');

	// Send user info when connected
	presenceSocket.addEventListener('open', () => {
		if (!presenceSocket) {
			return;
		}
		log('Socket open');
		const message: PresenceMessage = {
			type: 'user-add',
			payload: userId
		};
		presenceSocket.send(JSON.stringify(message));
	});

	// Handle presence updates
	presenceSocket.addEventListener('message', (event) => {
		try {
			log('Socket message', event);
			const messageFromJson = JSON.parse(event.data);
			const message = presenceMessageSchema.parse(messageFromJson);
			if (message.type === 'user-sync') {
				const activeUserIds = message.payload;
				onlineUserIds.set(new Set(activeUserIds));
			}
		} catch (error) {
			console.error(error);
		}
	});

	return {
		send: (message: PresenceMessage) => {
			if (!presenceSocket) {
				log('No socket to send message');
				return;
			}
			presenceSocket.send(JSON.stringify(message));
		},
		close: () => {
			if (!presenceSocket) {
				return;
			}

			const userId = get(currentUserId);
			if (!userId) {
				return;
			}

			log('Removing user', userId);
			const message: PresenceMessage = {
				type: 'user-remove',
				payload: userId
			};
			presenceSocket.send(JSON.stringify(message));

			presenceSocket.close();
			presenceSocket = null;
		}
	};
};
