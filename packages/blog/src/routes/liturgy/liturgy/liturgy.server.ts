import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { type Liturgy, liturgySchema } from './liturgy.schema';
import type { Locale } from '../locale/locale.schema';

const DATA_DIR = join(process.cwd(), 'src', 'data');
const SYMBOL_DIR = join(DATA_DIR, 'texts', 'symbol');

// Cache for different locales
const liturgyCache = new Map<string, Liturgy>();

export async function getLiturgyData(locale: Locale): Promise<Liturgy | null> {
	const cacheKey = locale.code;

	// Check if we have cached data for this locale
	if (liturgyCache.has(cacheKey)) {
		return liturgyCache.get(cacheKey)!;
	}

	try {
		// TODO: Make more dynamic

		// Dynamically import the liturgy data for the specific locale
		const liturgyFilePath = join(SYMBOL_DIR, `symbol.${locale.code}.json`);
		const liturgyData = await import(/* @vite-ignore */ liturgyFilePath);

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

export async function writeLiturgyData(liturgy: Liturgy): Promise<void> {
	// Determine file path based on language code
	const fileName = `symbol.${liturgy.language_code}.json`;
	const filePath = join(SYMBOL_DIR, fileName);

	// Ensure data directory exists
	await mkdir(SYMBOL_DIR, { recursive: true });

	// Write the updated liturgy data to file
	await writeFile(filePath, JSON.stringify(liturgy, null, 2), 'utf-8');
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
