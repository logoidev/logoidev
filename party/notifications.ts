import type * as Party from 'partykit/server';
import {
	notificationMessageSchema,
	type NotificationMessage,
	type NotificationPayload
} from './notifications.schema';

// import { rateLimit } from './utils/rate-limit';

export default class NotificationsServer implements Party.Server {
	options: Party.ServerOptions = { hibernate: true };
	constructor(readonly room: Party.Room) {}

	broadcastNotification(notification: NotificationPayload) {
		const notificationMesssage: NotificationMessage = {
			type: 'notifications-broadcast',
			payload: notification
		};
		const notificationJson = JSON.stringify(notificationMesssage);

		for (const connection of this.room.getConnections<string>()) {
			connection.send(notificationJson);
		}
	}

	onMessage(messageJson: string, sender: Party.Connection<string>) {
		// TODO: Figure out rate limit affecting state and data consistency
		// return rateLimit(sender, 100, () => {
		console.log('GOT message', messageJson);
		try {
			const messageFromJson = JSON.parse(messageJson);
			const message = notificationMessageSchema.parse(messageFromJson);

			console.log('GOT message parsed', message);

			if (message.type === 'notify') {
				// TODO: Check if user is admin
				this.broadcastNotification(message.payload);
			}
		} catch (error) {
			console.error(error);
		}
		// });
	}

	onClose() {
		console.log('Notifications server closed');
	}

	onError() {
		console.log('Notifications server error');
	}
}
