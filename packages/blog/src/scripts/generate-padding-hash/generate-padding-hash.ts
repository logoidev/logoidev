import crypto from 'crypto';

// Helper function to generate padding hash
export function generatePaddingHash(
	startPad: string,
	middlePad: string,
	endPad: string,
	extraPad1: string,
	extraPad2: string,
	extraPad3: string,
	algorithm: string = 'sha256',
	encoding: crypto.BinaryToTextEncoding = 'hex'
): string {
	// Take first character of each padding
	const paddingDigits =
		startPad[0] + middlePad[0] + endPad[0] + extraPad1[0] + extraPad2[0] + extraPad3[0];

	// Generate hash
	return crypto.createHash(algorithm).update(paddingDigits).digest(encoding);
}
