import PartySocket from 'partysocket';
import { get, writable } from 'svelte/store';

import { PARTYKIT_HOST, WITH_PARTYKIT } from '../partykit.constants';
import { makeLog } from '../partykit.utils';

import {
	notificationMessageSchema,
	type NotificationPayload,
	type NotificationMessage
} from 'party/notifications.schema';

const log = makeLog('[notifications]');

export const liveNotifications = writable<NotificationPayload[]>([]);

let notificationsSocket: PartySocket | null = null;

const DEFAULT_RETURN = {
	send: () => {},
	close: () => {}
};

export const initializeNotificationsSocket = (userId: string) => {
	if (!WITH_PARTYKIT) {
		console.warn('PartyKit is disabled, run with `pnpm dev:partykit` to enable');
		return DEFAULT_RETURN;
	}

	if (!userId) {
		log('No user id in PartyKit socket');
		return DEFAULT_RETURN;
	}

	notificationsSocket = new PartySocket({
		host: PARTYKIT_HOST,
		room: 'main',
		party: 'notifications',
		id: userId
	});
	log('PartyKit initialized');

	// Send user info when connected
	notificationsSocket.addEventListener('open', () => {
		log('Socket open');
	});

	// Handle presence updates
	notificationsSocket.addEventListener('message', (event) => {
		try {
			log('Socket message', event);

			const messageFromJson = JSON.parse(event.data);
			const message = notificationMessageSchema.parse(messageFromJson);

			if (message.type === 'notifications-broadcast') {
				const notification = message.payload;
				liveNotifications.set([...get(liveNotifications), notification]);
			}
		} catch (error) {
			console.error(error);
		}
	});

	return {
		send: (message: NotificationMessage) => {
			if (!notificationsSocket) {
				log('No socket to send message');
				return;
			}
			notificationsSocket.send(JSON.stringify(message));
		},
		close: () => {
			if (!notificationsSocket) {
				return;
			}

			notificationsSocket.close();
			notificationsSocket = null;
		}
	};
};
