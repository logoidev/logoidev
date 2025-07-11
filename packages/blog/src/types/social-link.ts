import { capitalizeFirst } from '../shared/utils';

export type SocialLinkType =
	| 'x'
	| 'twitter'
	| 'linkedin'
	| 'snap'
	| 'tiktok'
	| 'telegram'
	| 'discord'
	| 'facebook'
	| 'instagram'
	| 'youtube'
	| 'twitch'
	| 'github'
	| 'stack'
	| 'gumroad'
	| 'paypal'
	| 'cssbattle';

export interface FullSocialLink {
	name: string;
	type: SocialLinkType;
	image: string;
	url: string;
	alt?: string;
	qrImgUrl?: string;
}

export interface SocialLink extends Partial<FullSocialLink> {
	type: SocialLinkType;
	url: string;
	alt?: string;
}

export const getFullSocialLink = (socialLink: SocialLink): FullSocialLink => {
	const name = socialLink?.name || capitalizeFirst(socialLink.type);
	const alt = socialLink?.alt ?? `${name} Logo`;
	const image = socialLink.image ?? `/images/social/${socialLink.type}.svg`;
	return {
		...socialLink,
		name,
		alt,
		image
	};
};
