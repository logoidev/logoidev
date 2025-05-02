export type NotificationPayload = string;

export type NotificationMessage =
	| { type: 'notify'; payload: NotificationPayload }
	| { type: 'poll-notifications'; payload: { notifications: NotificationPayload[] } };
