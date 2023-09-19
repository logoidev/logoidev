import { Canvg } from 'canvg';

import { pause } from 'src/shared/utils';

export const svgToPng = async (svg: SVGElement) => {
	const serializer = new XMLSerializer();
	const svgString = serializer.serializeToString(svg);
	const canvas = document.createElement('canvas');
	const context = canvas?.getContext('2d');

	if (context) {
		const result = await Canvg.from(context, svgString);
		result.start();
	}

	await pause(100);
	const img = canvas.toDataURL('image/png');

	return img;
};
