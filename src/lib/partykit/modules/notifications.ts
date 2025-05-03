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

type SocketReturnType = {
	close: () => void;
	send: (type: NotificationMessage['type'], payload: NotificationMessage['payload']) => void;
	on: (
		type: NotificationMessage['type'],
		listener: (payload: NotificationMessage['payload']) => void
	) => void;
};

const DEFAULT_RETURN: SocketReturnType = {
	send: () => {},
	close: () => {},
	on: () => {}
};

export const initializeNotificationsSocket = (userId: string): SocketReturnType => {
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

	const listeners = new Map<
		NotificationMessage['type'],
		Array<(payload: NotificationMessage['payload']) => void>
	>();

	const onNotification = (notification: NotificationMessage) => {
		const notificationListeners = listeners.get(notification.type);
		if (notificationListeners?.length) {
			notificationListeners.forEach((listener) => listener(notification.payload));
		}
	};

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

			onNotification(message);

			if (message.type === 'notifications-broadcast') {
				const notification = message.payload;
				liveNotifications.set([...get(liveNotifications), notification]);
			}
		} catch (error) {
			console.error(error);
		}
	});

	return {
		send: (type: NotificationMessage['type'], payload: NotificationMessage['payload']) => {
			if (!notificationsSocket) {
				return;
			}

			const message: NotificationMessage = { type, payload };
			notificationsSocket.send(JSON.stringify(message));
		},
		close: () => {
			if (!notificationsSocket) {
				return;
			}

			listeners.clear();
			notificationsSocket.close();
			notificationsSocket = null;
		},
		on: (
			type: NotificationMessage['type'],
			listener: (payload: NotificationMessage['payload']) => void
		) => {
			const notificationListeners = listeners.get(type);
			if (notificationListeners) {
				notificationListeners.push(listener);
			} else {
				listeners.set(type, [listener]);
			}
		}
	};
};
