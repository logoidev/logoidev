/**
 * Generates a random string of specified length
 * @param length - The length of the string to generate
 * @returns A random string containing alphanumeric characters and common symbols
 */
export function generateRandomString(length: number): string {
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}
