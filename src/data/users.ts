import { Level } from '../components/StarsRating/types';
import { groupBy } from '../utils/lodash';
import { type UserData, UserIds } from '../types/user';

export const USERS: Array<UserData> = [
	{
		id: UserIds.AI,
		first_name: 'Adam',
		last_name: 'Iglesia',
		memojiCount: 10,
		email: 'ai@logoi.dev',
		titles: ['Executive Assistant'],
		level: Level.S,
		has_resume: false,
		hourly_rate_usd: 0,
		calendar_link: 'https://cal.com/logoi-ai',
		socials: [
			{
				type: 'telegram',
				url: 'https://t.me/logoi_ai',
				qrImgUrl: '/users/ai/qr-telegram-ai.webp'
			}
		],
		payments: []
	},
	{
		id: UserIds.V,
		first_name: 'Vlad',
		last_name: 'Kolbaia',
		memojiCount: 10,
		email: 'v@logoi.dev',
		titles: ['Founder & President'],
		level: Level.S,
		// TODO: [6] Rename field to "patterns", add ability to trigger different actions
		password: [0, 1, 2, 0, 1, 2],
		unlockImage: '/users/v/unlock.png',
		has_resume: true,
		hourly_rate_usd: 75,
		calendar_link: 'https://cal.com/logoi-v',
		socials: [
			{
				type: 'linkedin',
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/v1adko'
			},
			{
				type: 'twitter',
				url: 'https://twitter.com/v1adko_'
			},
			{
				type: 'snap',
				url: 'https://t.snapchat.com/fyGYetns',
				qrImgUrl: '/users/v/qr-snap.webp'
			},
			{
				type: 'telegram',
				url: 'https://t.me/logoi_v',
				qrImgUrl: '/users/v/qr-telegram-v.webp'
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
			}
			// {
			// 	type: 'cssbattle',
			// 	url: 'https://cssbattle.dev/player/v1adko',
			// 	name: 'CssBattle',
			// 	image: `/images/social/cssbattle.jpg`
			// }
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
		titles: ['Apprentice Software Engineer'],
		email: 'ap@logoi.dev',
		hourly_rate_usd: 0,
		has_resume: false,
		calendar_link: 'https://cal.com/logoi-ap',
		socials: [
			{
				type: 'linkedin',
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/andrewprokhorenko/'
			},
			{
				type: 'twitter',
				url: 'https://twitter.com/logoi_ap'
			},
			{
				type: 'snap',
				url: 'https://t.snapchat.com/DybHESuH',
				qrImgUrl: '/users/ap/qr-snap.webp'
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
			},
			{
				type: 'stack',
				alt: 'StackOverflow Logo',
				url: 'https://stackoverflow.com/users/20585039/andrew'
			}
		],
		payments: []
	}
];

const getInitials = (user: UserData) =>
	String(user.first_name.at(0)) + String(user.last_name.at(0));

export const USERS_GROUPED_BY_LEVEL = groupBy<UserData>(USERS, 'level');

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore I want the implicit coersion
export const USERS_SORTED_BY_NAME = USERS.sort((a, b) => getInitials(a) - getInitials(b));
