// TODO: [8] Optimize memoji images from .png to .webp
export const getMemojiAvatarUrl = (memojiIndex: number, userId: string) =>
	`/users/${userId}/memoji/${memojiIndex}.webp`;
