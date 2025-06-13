import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const reverseString = (str: string) => str.split('').reverse().join('');

const SEED = process.env.SECRET_PASSPHRASE_SEED || '';

// Default paddings from environment variables
const KEY_1 = process.env.SECRET_PASSPHRASE_KEY_1 || '1111';
const KEY_2 = process.env.SECRET_PASSPHRASE_KEY_2 || '2222';
const KEY_3 = process.env.SECRET_PASSPHRASE_KEY_3 || '3333';
const KEY_4 = process.env.SECRET_PASSPHRASE_KEY_4 || reverseString(KEY_3);
const KEY_5 = process.env.SECRET_PASSPHRASE_KEY_5 || reverseString(KEY_2);
const KEY_6 = process.env.SECRET_PASSPHRASE_KEY_6 || reverseString(KEY_1);

const KEYS = [KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6] as const;

export type PassphraseKeys = typeof KEYS;

// Maximum input length (including padding)
const MAX_INPUT_LENGTH = 1024;

// Calculate total padding length
const KEYS_COMBINED_LENGTH = KEYS.reduce((l, key) => l + key.length, 0);

// Maximum input length without padding (6 * 4 chars = 24 chars of padding)
export const MIN_INPUT_LENGTH = 4;

export const MAX_INPUT_LENGTH_WITH_PADDING = MAX_INPUT_LENGTH - KEYS_COMBINED_LENGTH;

export interface PassphraseResult {
	/** The encryption keys used to generate the passphrase */
	keys: PassphraseKeys;
	/** The original input string before padding */
	originalInput: string;
	/** The input string with encryption keys inserted at regular intervals */
	paddedInput: string;
	/** The length of the padded input string */
	inputLength: number;
	/** The length of the generated passphrase */
	outputLength: number;
	/** The generated passphrase in hexadecimal format */
	passphrase: string;
	/** The generated passphrase in base64 format */
	base64Passphrase: string;
	/** The SHA-256 hash of the padded input */
	hash: string;
}

export function generatePassphrase(input = SEED, keys: PassphraseKeys = KEYS): PassphraseResult {
	// Input validation
	if (typeof input !== 'string') {
		throw new Error('Input must be a string');
	}

	if (input.length < MIN_INPUT_LENGTH) {
		throw new Error(`Input length must be at least ${MIN_INPUT_LENGTH} characters`);
	}

	if (input.length > MAX_INPUT_LENGTH_WITH_PADDING) {
		throw new Error(
			`Input length plus padding exceeds maximum allowed length of ${MAX_INPUT_LENGTH_WITH_PADDING} characters`
		);
	}

	// Split input into 6 equidistant segments
	const numSegments = 6;
	const segmentLength = Math.floor(input.length / numSegments);
	const segments = Array.from({ length: numSegments }, (_, i) => {
		const start = i * segmentLength;
		const end = i === numSegments - 1 ? input.length : (i + 1) * segmentLength;
		return input.slice(start, end);
	});

	// Insert each key before each segment
	let paddedInput = '';
	for (let i = 0; i < numSegments; i++) {
		paddedInput += keys[i] + segments[i];
	}

	// Generate hash
	const hash = crypto.createHash('sha256').update(paddedInput).digest('hex');

	// Generate passphrase (first 24 bytes of hash as hex)
	const passphrase = hash.slice(0, 48);

	// Generate base64 passphrase (ensure 48 characters)
	const base64Hash = Buffer.from(hash.slice(0, 36), 'hex').toString('base64');
	const base64Passphrase = base64Hash.padEnd(48, '=');

	return {
		originalInput: input,
		keys,
		paddedInput,
		inputLength: paddedInput.length,
		outputLength: passphrase.length,
		passphrase,
		base64Passphrase,
		hash
	};
}

// CLI usage
if (require.main === module) {
	const args = process.argv.slice(2);
	const input = args[0] || 'a'.repeat(MAX_INPUT_LENGTH_WITH_PADDING + 1);

	try {
		const result = generatePassphrase(input, [KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6]);
		console.log('Original input:', result.originalInput);
		console.log('Keys:', result.keys);
		console.log('Padded input:', result.paddedInput);
		console.log('Input length:', result.inputLength, 'characters');
		console.log('\nHex version (48 chars):');
		console.log(result.passphrase);
		console.log('\nBase64 version (48 chars):');
		console.log(result.base64Passphrase);
		console.log('\nFull SHA-256 hash (64 chars):');
		console.log(result.hash);
	} catch (error) {
		console.error('Error:', error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}
