import { type Liturgy, liturgySchema } from './liturgy.schema';

import type { Locale } from '../locale/locale.schema';

// Cache for different locales
const liturgyCache = new Map<string, Liturgy>();

export async function getLiturgy(locale: Locale): Promise<Liturgy | null> {
	const cacheKey = locale.code;

	// Check if we have cached data for this locale
	if (liturgyCache.has(cacheKey)) {
		return liturgyCache.get(cacheKey)!;
	}

	try {
		// Dynamically import the liturgy data for the specific locale
		const liturgyData = await import(`./data/liturgy.${locale.code}.json`);

		// Log the raw data for debugging
		console.log(`Raw liturgy data for ${locale.code}:`, liturgyData.default);

		// Validate the data against our schema
		const parsedLiturgy = liturgySchema.safeParse(liturgyData.default);

		if (!parsedLiturgy.success) {
			console.error(
				`Liturgy data validation failed for locale ${locale.code}:`,
				parsedLiturgy.error
			);
			console.error(`Raw data that failed validation:`, liturgyData.default);
			return null;
		}

		// Cache the validated data for this locale
		liturgyCache.set(cacheKey, parsedLiturgy.data);

		return parsedLiturgy.data;
	} catch (error) {
		console.error(`Failed to load liturgy data for locale ${locale.code}:`, error);
		return null;
	}
}

// Function to clear cache (useful for development or when data changes)
export function clearLiturgyCache(): void {
	liturgyCache.clear();
}

// Function to get cache status (useful for debugging)
export function getLiturgyCacheStatus(): { size: number; keys: string[] } {
	return {
		size: liturgyCache.size,
		keys: Array.from(liturgyCache.keys())
	};
}
