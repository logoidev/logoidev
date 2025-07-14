import type { Liturgy } from './liturgy/liturgy.schema';
import type { Locale } from './locale/locale.schema';
import type { Speaker } from './speaker/speaker';

export interface AppData {
	liturgy: Liturgy | null;
	locale: Locale;
	speakers: Speaker[];
	isAdmin: boolean;
}
