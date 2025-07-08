import type * as Party from 'partykit/server';
import type { PresenceMessage, PresencePayload } from './presence.schema';
// import { rateLimit } from './utils/rate-limit';

export default class PresenceServer implements Party.Server {
	options: Party.ServerOptions = { hibernate: true };
	constructor(readonly room: Party.Room) {}

	updateUsers() {
		const presenceMessage = JSON.stringify(this.getPresenceMessage());
		for (const connection of this.room.getConnections<string>()) {
			connection.send(presenceMessage);
		}
	}

	getPresenceMessage(): PresenceMessage {
		const userIds = new Set<PresencePayload>();
		for (const connection of this.room.getConnections<string>()) {
			const userId = connection.state;
			if (userId) userIds.add(userId);
		}
		return {
			type: 'user-sync',
			payload: [...userIds]
		} satisfies PresenceMessage;
	}

	onMessage(messageJson: string, sender: Party.Connection<string>) {
		// TODO: Figure out rate limit affecting state and data consistency
		// return rateLimit(sender, 100, () => {
		const message = JSON.parse(messageJson) as PresenceMessage;

		if (message.type === 'user-add') {
			const userId = message.payload;
			sender.setState(userId);
			this.updateUsers();
		} else if (message.type === 'user-remove') {
			sender.setState(null);
			this.updateUsers();
		}
		// });
	}

	onClose() {
		this.updateUsers();
	}

	onError() {
		this.updateUsers();
	}
}
