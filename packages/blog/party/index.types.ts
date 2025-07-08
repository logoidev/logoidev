import type { PresenceMessage } from './presence.schema';
export type { PresenceMessage } from './presence.schema';

import type { NotificationMessage } from './notifications.schema';
export type { NotificationMessage } from './notifications.schema';

export type PartyKitMessage = PresenceMessage | NotificationMessage;
