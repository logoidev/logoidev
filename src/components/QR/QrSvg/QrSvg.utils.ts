import QRCode, { type QRCodeOptions } from 'qrcode';
import { getIndexUrl } from 'src/shared/routes';

type Binary = 0 | 1;
type BinaryArray = Array<Binary>;

const DEFAULT_CENTER_OFFSET = 2;

export type QrData = Array<BinaryArray>;

export interface QrDataResult {
	data: QrData;
	dataFiltered: QrData;
	padding: number;
}

const getFilteredData = (
	data: QrData,
	padding: number,
	centerOffset = DEFAULT_CENTER_OFFSET
): QrData => {
	const p = padding + 1;
	const size = data.length - 1;

	return data.map((line, y) =>
		line.map((value, x): Binary => {
			// Top left
			if (x < p && y < p) {
				return 0;
			}

			// Top right
			if (x > size - p && y < p) {
				return 0;
			}

			// Bottom left
			if (x < p && y > size - p) {
				return 0;
			}

			// Center
			if (
				x + centerOffset < size - p &&
				x - centerOffset > p &&
				y - centerOffset > p &&
				y + centerOffset < size - p
			) {
				return 0;
			}

			return value;
		})
	);
};

const getQrPaddingFromData = (data: BinaryArray): number => {
	for (let i = 0; i < data.length; i++) {
		if (data[i] !== 1) {
			return i;
		}
	}
	return 0;
};

const getQrBinaryArray = (text: string): QrData => {
	const result: QrData = [];
	try {
		const qrOptions: QRCodeOptions = {
			errorCorrectionLevel: 'high'
		};
		const code = QRCode.create(text, qrOptions);
		const data = Array.from(code.modules.data) as Array<0 | 1>;
		const sizeAmount = Math.ceil(Math.sqrt(data.length));

		for (let i = 0, j = 0; i < data.length; i++) {
			if (i > 0 && i % sizeAmount === 0) {
				j++;
			}

			if (result[j]?.length) {
				result[j].push(data[i]);
			} else {
				result[j] = [data[i]];
			}
		}
	} catch (err) {
		console.error(err);
	}
	return result;
};

export const getQrData = (text: string, centerOffset?: number): QrDataResult => {
	const result: QrDataResult = {
		data: [],
		dataFiltered: [],
		padding: 0
	};

	result.data = getQrBinaryArray(text);
	result.padding = getQrPaddingFromData(result.data[0]);
	result.dataFiltered = getFilteredData(result.data, result.padding - 1, centerOffset);

	return result;
};

const loadImage = async (url: string, size: number): Promise<HTMLImageElement> => {
	const img = document.createElement('img');
	img.src = url;
	img.width = size;
	img.height = size;
	return new Promise((resolve, reject) => {
		img.onload = () => resolve(img);
		img.onerror = reject;
	});
};

export const svgToPng = async (svg: SVGElement, size = 256) => {
	try {
		const svgAsXML = new XMLSerializer().serializeToString(svg);
		const svgSrc = `data:image/svg+xml,${encodeURIComponent(svgAsXML)}`;

		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const context = canvas.getContext('2d');

		if (!context) {
			return null;
		}

		context.beginPath();
		context.rect(0, 0, canvas.width, canvas.height);
		context.fillStyle = '#e2e2e2';
		context.fill();

		const image = await loadImage(svgSrc, size);
		// document.body.append(image);
		// TODO: Make canvas SVG renderer (buttons + center logo + dots)
		context.drawImage(image, 0, 0, canvas.width, canvas.height);

		const dataUrl = canvas.toDataURL(`image/png`, 1.0);

		return dataUrl;
	} catch (e) {
		const error = e as Error;
		console.log(`Error while saving to png${error?.message ? `: ${error.message}` : '.'}`);
		return null;
	}
};

export const normaliseQrLocalhostUrl = (url: string) => {
	if (url.includes('localhost')) {
		const trailing = url.split('/').slice(3).join('/');
		return getIndexUrl() + '/' + trailing;
	}
	return url;
};
