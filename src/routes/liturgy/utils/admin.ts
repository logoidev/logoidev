import { env } from '$env/dynamic/private';

/**
 * Checks if the provided admin code is valid
 * @param adminCode - The admin code to validate
 * @returns boolean indicating if the admin code is valid
 */
export function isValidAdminCode(adminCode: string | null): boolean {
	return adminCode === env.SECRET_ADMIN_CODE;
}

/**
 * Extracts and validates admin code from URL search parameters
 * @param url - The URL object containing search parameters
 * @returns boolean indicating if the admin code in the URL is valid
 */
export function isAdminFromUrl(url: URL): boolean {
	const adminCode = url.searchParams.get('code');
	return isValidAdminCode(adminCode);
}
