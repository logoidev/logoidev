import type { IntRange } from 'src/utils/types';
import type { QrPasswordNumber } from 'src/components/QR/QrButtons.types';
import type { Level } from 'src/components/StarsRating/types';
import type { SocialLink } from './social-link';

export enum UserIds {
	V = 'v',
	AP = 'ap',
	AI = 'ai'
}

export interface UserData {
	id: UserIds;
	first_name: string;
	last_name: string;
	memojiCount: IntRange<1, 11>;
	titles: Array<string>;
	hourly_rate_usd: number;
	level: Level;
	email: string;
	calendar_link?: string;
	socials: Array<SocialLink>;
	payments: Array<SocialLink>;
	has_resume: boolean;
	password?: Array<QrPasswordNumber>;
	unlockImage?: string;
	chat?: {
		link: string;
		image_url: string;
	};
}
