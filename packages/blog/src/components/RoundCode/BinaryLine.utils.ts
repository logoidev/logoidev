import { DEFAULT_SIZE_PX } from './RoundCode.consts';

type Byte = 0 | 1;

interface Rect {
	index: number;
	width: number;
}

interface RectPx {
	offsetPx: number;
	widthPx: number;
}

export const rectToRectPx = (rect: Rect, sizePx: number): RectPx => ({
	offsetPx: rect.index * sizePx,
	widthPx: rect.width * sizePx
});

export const getRectsFromByteString = (byte: string) => {
	let rect: Rect | null = null;
	const rects: Array<Rect> = [];

	for (let i = 0; i < byte.length; i++) {
		const newValue = +byte[i] as Byte;

		if (newValue === 1) {
			if (rect) {
				rect.width += 1;
			} else {
				rect = { index: i, width: 1 };
			}
		} else {
			if (rect) {
				rects.push(rect);
				rect = null;
			}
		}
	}

	if (rect) {
		rects.push(rect);
		rect = null;
	}

	return rects;
};

export const getRectsPxFromByteString = (byte: string, sizePx: number = DEFAULT_SIZE_PX) =>
	getRectsFromByteString(byte).map((rect) => rectToRectPx(rect, sizePx));
