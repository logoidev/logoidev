import { vi, test, describe, expect, beforeAll, afterAll } from 'vitest';
import {
	generatePassphrase,
	MIN_INPUT_LENGTH,
	MAX_INPUT_LENGTH_WITH_PADDING,
	type PassphraseResult,
	type PassphraseKeys
} from './generate-passphrase';

describe('generate-passphrase', () => {
	// Test constants
	const validInput = 'Logoi Development Ltd.™';
	const minInput = 'a'.repeat(MIN_INPUT_LENGTH);
	const maxInput = 'a'.repeat(MAX_INPUT_LENGTH_WITH_PADDING);
	const maxInputMinusOne = 'a'.repeat(MAX_INPUT_LENGTH_WITH_PADDING - 1);
	const maxInputPlusOne = 'a'.repeat(MAX_INPUT_LENGTH_WITH_PADDING + 1);

	const getKeys = (): PassphraseKeys => {
		return [
			process.env.SECRET_PASSPHRASE_KEY_1 || '1111',
			process.env.SECRET_PASSPHRASE_KEY_2 || '2222',
			process.env.SECRET_PASSPHRASE_KEY_3 || '3333',
			process.env.SECRET_PASSPHRASE_KEY_4 || '4444',
			process.env.SECRET_PASSPHRASE_KEY_5 || '5555',
			process.env.SECRET_PASSPHRASE_KEY_6 || '6666'
		];
	};

	// Default keys
	const defaultKeys: PassphraseKeys = getKeys();

	// Store original env values
	let originalEnv: { [key: string]: string | undefined };

	beforeAll(() => {
		originalEnv = {
			SECRET_PASSPHRASE_KEY_1: process.env.SECRET_PASSPHRASE_KEY_1,
			SECRET_PASSPHRASE_KEY_2: process.env.SECRET_PASSPHRASE_KEY_2,
			SECRET_PASSPHRASE_KEY_3: process.env.SECRET_PASSPHRASE_KEY_3,
			SECRET_PASSPHRASE_KEY_4: process.env.SECRET_PASSPHRASE_KEY_4,
			SECRET_PASSPHRASE_KEY_5: process.env.SECRET_PASSPHRASE_KEY_5,
			SECRET_PASSPHRASE_KEY_6: process.env.SECRET_PASSPHRASE_KEY_6
		};
	});

	afterAll(() => {
		// Restore original env values
		process.env.SECRET_PASSPHRASE_KEY_1 = originalEnv.SECRET_PASSPHRASE_KEY_1;
		process.env.SECRET_PASSPHRASE_KEY_2 = originalEnv.SECRET_PASSPHRASE_KEY_2;
		process.env.SECRET_PASSPHRASE_KEY_3 = originalEnv.SECRET_PASSPHRASE_KEY_3;
		process.env.SECRET_PASSPHRASE_KEY_4 = originalEnv.SECRET_PASSPHRASE_KEY_4;
		process.env.SECRET_PASSPHRASE_KEY_5 = originalEnv.SECRET_PASSPHRASE_KEY_5;
		process.env.SECRET_PASSPHRASE_KEY_6 = originalEnv.SECRET_PASSPHRASE_KEY_6;
	});

	describe('Environment Variables', () => {
		test('uses environment variables when available', async () => {
			process.env.SECRET_PASSPHRASE_KEY_1 = '9999';
			process.env.SECRET_PASSPHRASE_KEY_2 = '8888';
			process.env.SECRET_PASSPHRASE_KEY_3 = '7777';
			process.env.SECRET_PASSPHRASE_KEY_4 = '6666';
			process.env.SECRET_PASSPHRASE_KEY_5 = '5555';
			process.env.SECRET_PASSPHRASE_KEY_6 = '4444';

			vi.resetModules();
			const { generatePassphrase } = await import('./generate-passphrase.js');
			const envKeys = getKeys();
			const result = generatePassphrase(validInput, envKeys);
			expect(result.keys[0]).toBe('9999');
			expect(result.keys[1]).toBe('8888');
			expect(result.keys[2]).toBe('7777');
			expect(result.keys[3]).toBe('6666');
			expect(result.keys[4]).toBe('5555');
			expect(result.keys[5]).toBe('4444');
		});

		test('falls back to default values when environment variables are not set', async () => {
			delete process.env.SECRET_PASSPHRASE_KEY_1;
			delete process.env.SECRET_PASSPHRASE_KEY_2;
			delete process.env.SECRET_PASSPHRASE_KEY_3;
			delete process.env.SECRET_PASSPHRASE_KEY_4;
			delete process.env.SECRET_PASSPHRASE_KEY_5;
			delete process.env.SECRET_PASSPHRASE_KEY_6;

			// Reload the module after unsetting env vars
			vi.resetModules();
			const { generatePassphrase } = await import('./generate-passphrase.js');
			const result = generatePassphrase(validInput, defaultKeys);
			expect(result.keys[0]).toBe('1111');
			expect(result.keys[1]).toBe('2222');
			expect(result.keys[2]).toBe('3333');
			expect(result.keys[3]).toBe('4444');
			expect(result.keys[4]).toBe('5555');
			expect(result.keys[5]).toBe('6666');
		});
	});

	describe('Input Validation', () => {
		test('throws error if input is not a string', () => {
			// @ts-expect-error Testing invalid input type
			expect(() => generatePassphrase(123, defaultKeys)).toThrow('Input must be a string');
		});

		test('throws error if input is shorter than MIN_INPUT_LENGTH', () => {
			expect(() => generatePassphrase('a'.repeat(MIN_INPUT_LENGTH - 1), defaultKeys)).toThrow(
				`Input length must be at least ${MIN_INPUT_LENGTH} characters`
			);
		});

		test('succeeds if input is exactly MIN_INPUT_LENGTH', () => {
			expect(() => generatePassphrase(minInput, defaultKeys)).not.toThrow();
		});

		test('throws error if input is longer than MAX_INPUT_LENGTH_WITH_PADDING', () => {
			expect(() =>
				generatePassphrase('a'.repeat(MAX_INPUT_LENGTH_WITH_PADDING + 1), defaultKeys)
			).toThrow(
				`Input length plus padding exceeds maximum allowed length of ${MAX_INPUT_LENGTH_WITH_PADDING} characters`
			);
		});

		test('succeeds if input is exactly MAX_INPUT_LENGTH_WITH_PADDING', () => {
			expect(() => generatePassphrase(maxInput, defaultKeys)).not.toThrow();
		});

		test('succeeds if input is one less than MAX_INPUT_LENGTH_WITH_PADDING', () => {
			expect(() => generatePassphrase(maxInputMinusOne, defaultKeys)).not.toThrow();
		});

		test('throws error if input is one more than MAX_INPUT_LENGTH_WITH_PADDING', () => {
			expect(() => generatePassphrase(maxInputPlusOne, defaultKeys)).toThrow(
				`Input length plus padding exceeds maximum allowed length of ${MAX_INPUT_LENGTH_WITH_PADDING} characters`
			);
		});

		test('verifies total padded input length with maximum input', () => {
			const result = generatePassphrase('a'.repeat(MAX_INPUT_LENGTH_WITH_PADDING), defaultKeys);
			// MAX_INPUT_LENGTH_WITH_PADDING + all padding lengths
			const expectedTotalLength =
				MAX_INPUT_LENGTH_WITH_PADDING + defaultKeys.reduce((sum, key) => sum + key.length, 0);
			expect(result.inputLength).toBe(expectedTotalLength);
			expect(result.paddedInput.length).toBe(expectedTotalLength);
		});

		test('verifies total padded input length with minimum input', () => {
			const result = generatePassphrase(minInput, defaultKeys);
			// MIN_INPUT_LENGTH + all padding lengths
			const expectedTotalLength =
				MIN_INPUT_LENGTH + defaultKeys.reduce((sum, key) => sum + key.length, 0);
			expect(result.inputLength).toBe(expectedTotalLength);
			expect(result.paddedInput.length).toBe(expectedTotalLength);
		});

		test('verifies padding is correctly applied to input', () => {
			const input = 'test';
			const result = generatePassphrase(input, defaultKeys);

			// Split input into 6 equidistant segments
			const numSegments = 6;
			const segmentLength = Math.floor(input.length / numSegments);
			const segments = Array.from({ length: numSegments }, (_, i) => {
				const start = i * segmentLength;
				const end = i === numSegments - 1 ? input.length : (i + 1) * segmentLength;
				return input.slice(start, end);
			});
			const expectedPaddedInput = defaultKeys.map((key, i) => key + segments[i]).join('');

			expect(result.paddedInput).toBe(expectedPaddedInput);
			expect(result.inputLength).toBe(
				input.length + defaultKeys.reduce((sum, key) => sum + key.length, 0)
			);
		});
	});

	describe('Output Properties', () => {
		test('produces deterministic output for same input and keys', () => {
			const result1 = generatePassphrase(validInput, defaultKeys);
			const result2 = generatePassphrase(validInput, defaultKeys);
			expect(result1.passphrase).toBe(result2.passphrase);
			expect(result1.base64Passphrase).toBe(result2.base64Passphrase);
			expect(result1.hash).toBe(result2.hash);
		});

		test('handles emoji input consistently', () => {
			const emojiInput = '🌟'.repeat(4); // Ensure minimum length
			const result1 = generatePassphrase(emojiInput, defaultKeys);
			const result2 = generatePassphrase(emojiInput, defaultKeys);

			// Verify both generations produce identical results
			expect(result1.passphrase).toBe(result2.passphrase);
			expect(result1.base64Passphrase).toBe(result2.base64Passphrase);
			expect(result1.hash).toBe(result2.hash);

			// Verify the output format
			expect(result1.passphrase.length).toBe(48);
			expect(result1.base64Passphrase.length).toBe(48);
			expect(result1.hash.length).toBe(64); // SHA-256 produces 64 hex characters
		});

		test('passphrase output follows correct format', () => {
			const result = generatePassphrase(validInput, defaultKeys);

			// Verify hex passphrase format (48 hex characters)
			expect(result.passphrase).toMatch(/^[0-9a-f]{48}$/);

			// Verify base64 passphrase format (48 base64 characters, including padding)
			expect(result.base64Passphrase).toMatch(/^[A-Za-z0-9+/=]{48}$/);

			// Verify full hash format (64 hex characters)
			expect(result.hash).toMatch(/^[0-9a-f]{64}$/);
		});

		test('produces different output for different keys', () => {
			const result1 = generatePassphrase(validInput, [
				'1111',
				'2222',
				'3333',
				'4444',
				'5555',
				'6666'
			]);
			const result2 = generatePassphrase(validInput, [
				'9999',
				'8888',
				'7777',
				'6666',
				'5555',
				'4444'
			]);
			expect(result1.passphrase).not.toBe(result2.passphrase);
			expect(result1.base64Passphrase).not.toBe(result2.base64Passphrase);
			expect(result1.hash).not.toBe(result2.hash);
		});

		test('produces different output for different input', () => {
			const result1 = generatePassphrase('input1', defaultKeys);
			const result2 = generatePassphrase('input2', defaultKeys);
			expect(result1.passphrase).not.toBe(result2.passphrase);
			expect(result1.base64Passphrase).not.toBe(result2.base64Passphrase);
			expect(result1.hash).not.toBe(result2.hash);
		});

		test('maintains consistent output length regardless of input size', () => {
			// Test with minimum length input
			const minResult = generatePassphrase(minInput, defaultKeys);
			expect(minResult.passphrase.length).toBe(48);
			expect(minResult.base64Passphrase.length).toBe(48);

			// Test with maximum length input
			const maxResult = generatePassphrase('a'.repeat(MAX_INPUT_LENGTH_WITH_PADDING), defaultKeys);
			expect(maxResult.passphrase.length).toBe(48);
			expect(maxResult.base64Passphrase.length).toBe(48);

			// Test with a random length input
			const randomLength =
				Math.floor(Math.random() * (MAX_INPUT_LENGTH_WITH_PADDING - MIN_INPUT_LENGTH)) +
				MIN_INPUT_LENGTH;
			const randomResult = generatePassphrase(generateRandomString(randomLength), defaultKeys);
			expect(randomResult.passphrase.length).toBe(48);
			expect(randomResult.base64Passphrase.length).toBe(48);
		});
	});

	describe('Security Properties', () => {
		test('produces different hashes for max length input variations', () => {
			const maxLengthInput = 'a'.repeat(MAX_INPUT_LENGTH_WITH_PADDING);
			const oneCharLess = maxLengthInput.slice(0, -1);

			const resultMax = generatePassphrase(maxLengthInput, defaultKeys);
			const resultLess = generatePassphrase(oneCharLess, defaultKeys);

			// All hashes should be different
			expect(resultMax.hash).not.toBe(resultLess.hash);
			expect(resultMax.passphrase).not.toBe(resultLess.passphrase);
			expect(resultMax.base64Passphrase).not.toBe(resultLess.base64Passphrase);
		});

		test('hash changes when a single random character is replaced in a max length string', () => {
			// Generate a random string of maximum length
			const originalString = generateRandomString(MAX_INPUT_LENGTH_WITH_PADDING);

			// Choose a random position to modify
			const positionToChange = Math.floor(Math.random() * MAX_INPUT_LENGTH_WITH_PADDING);

			// Generate a new random character that's different from the original
			const originalChar = originalString[positionToChange];
			let newChar;
			do {
				newChar = generateRandomString(1);
			} while (newChar === originalChar);

			// Create the modified string
			const modifiedString =
				originalString.slice(0, positionToChange) +
				newChar +
				originalString.slice(positionToChange + 1);

			// Generate passphrases for both strings
			const originalResult = generatePassphrase(originalString, defaultKeys);
			const modifiedResult = generatePassphrase(modifiedString, defaultKeys);

			// Verify that all outputs are different
			expect(modifiedResult.hash).not.toBe(originalResult.hash);
			expect(modifiedResult.passphrase).not.toBe(originalResult.passphrase);
			expect(modifiedResult.base64Passphrase).not.toBe(originalResult.base64Passphrase);
		});

		test('maintains avalanche effect for small input changes', () => {
			const baseInput = 'test input';
			const results = new Set();

			// Test multiple single-character changes
			for (let i = 0; i < baseInput.length; i++) {
				const modifiedInput =
					baseInput.slice(0, i) +
					String.fromCharCode(baseInput.charCodeAt(i) + 1) +
					baseInput.slice(i + 1);

				const result = generatePassphrase(modifiedInput, defaultKeys);
				results.add(result.passphrase);
			}

			// Each modification should produce a unique result
			expect(results.size).toBe(baseInput.length);
		});

		test('padding hash is consistent for same key values', () => {
			const keys: PassphraseKeys = ['1111', '2222', '3333', '4444', '5555', '6666'];
			const result1 = generatePassphrase(validInput, keys);
			const result2 = generatePassphrase(validInput, keys);
			expect(result1.passphrase).toBe(result2.passphrase);
		});

		test('padding hash changes when any key value changes', () => {
			const baseKeys: PassphraseKeys = ['1111', '2222', '3333', '4444', '5555', '6666'];
			const baseResult = generatePassphrase(validInput, baseKeys);

			const changedKey1: PassphraseKeys = [
				'9999',
				baseKeys[1],
				baseKeys[2],
				baseKeys[3],
				baseKeys[4],
				baseKeys[5]
			];
			const changedKey2: PassphraseKeys = [
				baseKeys[0],
				'9999',
				baseKeys[2],
				baseKeys[3],
				baseKeys[4],
				baseKeys[5]
			];
			const changedKey3: PassphraseKeys = [
				baseKeys[0],
				baseKeys[1],
				'9999',
				baseKeys[3],
				baseKeys[4],
				baseKeys[5]
			];
			const changedKey4: PassphraseKeys = [
				baseKeys[0],
				baseKeys[1],
				baseKeys[2],
				'9999',
				baseKeys[4],
				baseKeys[5]
			];
			const changedKey5: PassphraseKeys = [
				baseKeys[0],
				baseKeys[1],
				baseKeys[2],
				baseKeys[3],
				'9999',
				baseKeys[5]
			];
			const changedKey6: PassphraseKeys = [
				baseKeys[0],
				baseKeys[1],
				baseKeys[2],
				baseKeys[3],
				baseKeys[4],
				'9999'
			];

			const result1 = generatePassphrase(validInput, changedKey1);
			const result2 = generatePassphrase(validInput, changedKey2);
			const result3 = generatePassphrase(validInput, changedKey3);
			const result4 = generatePassphrase(validInput, changedKey4);
			const result5 = generatePassphrase(validInput, changedKey5);
			const result6 = generatePassphrase(validInput, changedKey6);

			expect(result1.passphrase).not.toBe(baseResult.passphrase);
			expect(result2.passphrase).not.toBe(baseResult.passphrase);
			expect(result3.passphrase).not.toBe(baseResult.passphrase);
			expect(result4.passphrase).not.toBe(baseResult.passphrase);
			expect(result5.passphrase).not.toBe(baseResult.passphrase);
			expect(result6.passphrase).not.toBe(baseResult.passphrase);
		});

		test('handles special characters in input correctly', () => {
			const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
			const result = generatePassphrase(specialChars, defaultKeys);
			expect(result.passphrase.length).toBe(48);
			expect(result.base64Passphrase.length).toBe(48);
		});
	});

	describe('Result Structure', () => {
		test('returns complete result object with all required properties', () => {
			const result = generatePassphrase(validInput, defaultKeys);

			expect(result).toHaveProperty('originalInput', validInput);
			expect(result).toHaveProperty('keys', defaultKeys);
			expect(result).toHaveProperty('paddedInput');
			expect(result).toHaveProperty('inputLength');
			expect(result).toHaveProperty('passphrase');
			expect(result).toHaveProperty('base64Passphrase');
			expect(result).toHaveProperty('hash');

			// Verify property types
			expect(typeof result.originalInput).toBe('string');
			expect(Array.isArray(result.keys)).toBe(true);
			expect(typeof result.paddedInput).toBe('string');
			expect(typeof result.inputLength).toBe('number');
			expect(typeof result.passphrase).toBe('string');
			expect(typeof result.base64Passphrase).toBe('string');
			expect(typeof result.hash).toBe('string');
		});

		test('result object matches PassphraseResult interface', () => {
			const result = generatePassphrase(validInput, defaultKeys);
			expect(result).toMatchObject<PassphraseResult>({
				originalInput: expect.any(String),
				keys: expect.any(Array),
				paddedInput: expect.any(String),
				inputLength: expect.any(Number),
				passphrase: expect.any(String),
				base64Passphrase: expect.any(String),
				hash: expect.any(String)
			});
		});
	});
});

// Use the local helper function for random string generation
function generateRandomString(length: number): string {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}
