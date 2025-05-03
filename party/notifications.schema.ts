import { z } from 'zod';

export const notificationPayloadSchema = z.object({
	title: z.string(),
	message: z.string(),
	action: z.string().optional(),
	icon: z.string().optional()
});

export const notificationMessageSchema = z.object({
	type: z.enum(['notify', 'notifications-broadcast']),
	payload: notificationPayloadSchema
});

export type NotificationPayload = z.infer<typeof notificationPayloadSchema>;
export type NotificationMessage = z.infer<typeof notificationMessageSchema>;
