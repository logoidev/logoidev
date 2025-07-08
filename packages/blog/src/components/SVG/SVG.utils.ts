const XMLNS = 'http://www.w3.org/2000/svg';

interface GetViewBox {
	width: number;
	height: number;
	x?: number;
	y?: number;
	viewBoxScale?: number;
}

export const getViewBox = ({ width, height, x, y, viewBoxScale = 2 }: GetViewBox) =>
	[x ?? 0, y ?? 0, width * (viewBoxScale ?? 2), height * (viewBoxScale ?? 2)].join(' ');

interface GetSvgParams extends GetViewBox {
	fill?: string;
}

export const getSvgParams = ({ fill, ...rest }: GetSvgParams) => {
	const viewBox = getViewBox(rest);

	return {
		width: rest.width,
		height: rest.height,
		fill,
		viewBox,
		xmlns: XMLNS,
		class: 'w-full h-full'
	};
};
