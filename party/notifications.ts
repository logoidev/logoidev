import type * as Party from 'partykit/server';
import { NotificationMessage, NotificationPayload } from './notifications.types';
import { rateLimit } from './utils/rate-limit';

export default class NotificationsServer implements Party.Server {
	options: Party.ServerOptions = { hibernate: true };
	constructor(readonly room: Party.Room) {}

	broadcastNotifications() {
		const notification = this.getNotificationMessage();
		const notificationJson = JSON.stringify(notification);
		for (const connection of this.room.getConnections<string>()) {
			connection.send(notificationJson);
		}
	}

	getNotificationMessage(): NotificationMessage {
		const notifications: NotificationPayload[] = [];
		for (const connection of this.room.getConnections<NotificationPayload>()) {
			const notification = connection.state;
			if (notification) notifications.push(notification);
		}
		return {
			type: 'poll-notifications',
			payload: { notifications }
		};
	}

	onMessage(messageJson: string, sender: Party.Connection<string>) {
		return rateLimit(sender, 100, () => {
			const message = JSON.parse(messageJson) as NotificationMessage;

			if (message.type === 'notify') {
				// TODO: Figure out admin/auth check
				sender.setState(message.payload);
			} else if (message.type === 'poll-notifications') {
				sender.setState(null);
			}

			this.broadcastNotifications();
		});
	}

	onClose() {
		this.broadcastNotifications();
	}

	onError() {
		this.broadcastNotifications();
	}
}
