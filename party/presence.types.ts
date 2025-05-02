export type PresencePayload = string;

export type PresenceMessage =
	| { type: 'remove-user'; payload: PresencePayload }
	| { type: 'add-user'; payload: PresencePayload }
	| { type: 'presence-update'; payload: { userIds: PresencePayload[] } };
