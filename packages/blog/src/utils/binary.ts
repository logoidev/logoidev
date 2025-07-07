type ByteString = string; // '01010110'
type Bytes = ByteString[];

export const stringToBytes = (text: string): Bytes => {
	const bytes: Bytes = [];
	for (let i = 0; i < text.length; i++) {
		const byte = text.charCodeAt(i).toString(2);
		bytes.push(byte);
	}
	return bytes;
};

export const bytesToString = (bytes: Bytes) => {
	const chars = bytes.map((byte) => String.fromCharCode(parseInt(byte, 2)));
	return chars.join('');
};

export const stringToByteString = (text: string, separator = ' '): ByteString =>
	stringToBytes(text).join(separator);

export const byteStringToString = (byteString: ByteString, separator = ' ') =>
	bytesToString(byteString.split(separator));

export const invertBinaryString = (byteString: ByteString, ignoreChars = [' ', ':']) =>
	byteString
		.split('')
		.map((bit) => (ignoreChars.includes(bit) ? bit : bit === '1' ? '0' : '1'))
		.join('');

export const invertBytes = (bytes: Bytes): Bytes => bytes.map((byte) => invertBinaryString(byte));

export const getRandomBit = (ratio = 0.5) => (Math.random() < ratio ? 1 : 0);
export const createByteString = (size = 8, ratio?: number) =>
	new Array(size)
		.fill(1)
		.map(() => getRandomBit(ratio))
		.join('');
export const getByteStrings = (bytes: number, ratio?: number) =>
	new Array(bytes).fill(1).map(() => createByteString(undefined, ratio));
