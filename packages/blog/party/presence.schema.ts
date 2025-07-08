import { z } from 'zod';

const presencePayloadSchema = z.string();

const presenceUserAddPayloadSchema = z.object({
	type: z.literal('user-add'),
	payload: presencePayloadSchema
});

const presenceUserSyncPayloadSchema = z.object({
	type: z.literal('user-sync'),
	payload: z.array(presencePayloadSchema)
});

const presenceUserRemovePayloadSchema = z.object({
	type: z.literal('user-remove'),
	payload: presencePayloadSchema
});

export const presenceMessageSchema = z.union([
	presenceUserAddPayloadSchema,
	presenceUserSyncPayloadSchema,
	presenceUserRemovePayloadSchema
]);

export type PresencePayload = z.infer<typeof presencePayloadSchema>;
export type PresenceMessage = z.infer<typeof presenceMessageSchema>;
