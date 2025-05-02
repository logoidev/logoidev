import type * as Party from 'partykit/server';
import { PresenceMessage } from './presence.types';

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
		const userIds = new Set<string>();
		for (const connection of this.room.getConnections<string>()) {
			const userId = connection.state;
			if (userId) userIds.add(userId);
		}
		return {
			type: 'presence-update',
			payload: { userIds: [...userIds] }
		} satisfies PresenceMessage;
	}

	onMessage(message: string, sender: Party.Connection<string>) {
		const user = JSON.parse(message) as PresenceMessage;
		if (user.type === 'add-user') {
			sender.setState(user.payload);
			this.updateUsers();
		} else if (user.type === 'remove-user') {
			sender.setState(null);
			this.updateUsers();
		}
	}

	onClose() {
		this.updateUsers();
	}

	onError() {
		this.updateUsers();
	}
}
