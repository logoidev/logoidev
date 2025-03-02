import { Level } from 'src/components/StarsRating/types';
import { groupBy } from '../utils/lodash';
import { type UserData, UserIds } from '../types/user';
import { CALENDAR_LINK } from 'src/shared/constants';

export const USERS: Array<UserData> = [
	{
		id: UserIds.AI,
		first_name: 'Adam',
		last_name: 'Iglesia',
		memojiCount: 10,
		email: 'ai@logoi.dev',
		titles: ['Creative Technologist'],
		level: Level.S,
		has_resume: false,
		hourly_rate_usd: 0,
		socials: [
			{
				type: 'telegram',
				url: 'https://t.me/logoi_ai',
				qrImgUrl: '/users/ai/qr-telegram-ai.webp'
			}
		],
		payments: [],
		chat: {
			link: '/adam',
			image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/ChatGPT-Logo.svg'
		}
	},
	{
		id: UserIds.V,
		first_name: 'Vlad',
		last_name: 'Kolbaia',
		memojiCount: 10,
		email: 'vlad@logoi.dev',
		titles: ['Senior Software Engineer | Founder'],
		level: Level.S,
		// TODO: [6] Rename field to "patterns", add ability to trigger different actions
		password: [0, 1, 2, 0, 1, 2],
		unlockImage: '/users/v/unlock.webp',
		has_resume: false,
		hourly_rate_usd: 75,
		calendar_link: CALENDAR_LINK,
		socials: [
			{
				type: 'linkedin',
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/v1adko'
			},
			{
				type: 'github',
				url: 'https://github.com/v1adko',
				name: 'GitHub'
			},
			{
				type: 'stack',
				alt: 'StackOverflow Logo',
				url: 'https://stackoverflow.com/users/6426334/vlad-kolbaia'
			},
			{
				type: 'telegram',
				url: 'https://t.me/logoi_v',
				qrImgUrl: '/users/v/qr-telegram-v.webp'
			}
		],
		// TODO: Add square
		payments: [
			{
				type: 'paypal',
				url: 'https://paypal.me/logoidev',
				name: 'PayPal'
			},
			{
				type: 'gumroad',
				url: 'https://v1adko.gumroad.com/l/111'
			}
		]
	},
	{
		id: UserIds.AP,
		first_name: 'Andrew',
		last_name: 'Prokhorenko',
		memojiCount: 10,
		level: Level.D,
		titles: ['Apprentice Engineer'],
		email: 'ap@logoi.dev',
		hourly_rate_usd: 0,
		has_resume: false,
		socials: [
			{
				type: 'linkedin',
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/andrewprokhorenko/'
			},
			{
				type: 'telegram',
				url: 'https://t.me/AndrewProkhorenko',
				qrImgUrl: '/users/ap/qr-telegram-ap.webp'
			},
			{
				type: 'github',
				name: 'GitHub',
				url: 'https://github.com/AndrewProkhorenko'
			}
		],
		payments: []
	}
];

const getInitials = (user: UserData) =>
	String(user.first_name.at(0)) + String(user.last_name.at(0));

export const getUserById = (userId: string) => USERS.find((u) => u.id === userId);

export const USERS_GROUPED_BY_LEVEL = groupBy<UserData>(USERS, 'level');

export const VLAD = getUserById(UserIds.V)!;
export const ADAM = getUserById(UserIds.AI)!;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore I want the implicit coersion
export const USERS_SORTED_BY_NAME = USERS.sort((a, b) => getInitials(a) - getInitials(b));
