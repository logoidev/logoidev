export type PresenceMessage =
	| { type: 'remove-user'; payload: string }
	| { type: 'add-user'; payload: string }
	| { type: 'presence-update'; payload: { userIds: string[] } };
