export enum QrPosition {
	BOTTOM_LEFT = 'bl',
	TOP_LEFT = 'tl',
	TOP_RIGHT = 'tr'
}

export type QrPasswordNumber = 0 | 1 | 2;

export type QrPassword = Array<QrPasswordNumber>;

export const QrPositionToNumber: Record<QrPosition, QrPasswordNumber> = {
	[QrPosition.BOTTOM_LEFT]: 0,
	[QrPosition.TOP_LEFT]: 1,
	[QrPosition.TOP_RIGHT]: 2
};

export enum QrState {
	UNTOUCHED = 'untouched',
	TOUCHED = 'touched',
	LOCKED = 'locked',
	UNLOCKED = 'unlocked',
	FAILED = 'failed',
	FAILED_ATTEMPT = 'failed-attempt'
}
