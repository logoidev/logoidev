import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { type Liturgy, liturgySchema } from './liturgy.schema';
import type { Locale, LocaleCode } from '../locale/locale.schema';

const LEVELS_TO_ROOT = 4;

const DIRECTORIES_TO_ROOT = Array.from({ length: LEVELS_TO_ROOT })
	.map(() => '..')
	.join('/');

// Get the directory path relative to the current file
const packageRoot = join(import.meta.dirname, DIRECTORIES_TO_ROOT);

const SYMBOL_DIR = join(packageRoot, 'src/data/texts/symbol');

const getSymbolFileName = (localeCode: LocaleCode) => `symbol.${localeCode}.json`;

// Cache for different locales
const liturgyCache = new Map<string, Liturgy>();

export async function getLiturgyData(locale: Locale): Promise<Liturgy | null> {
	const cacheKey = locale.code;

	// Check if we have cached data for this locale
	if (liturgyCache.has(cacheKey)) {
		return liturgyCache.get(cacheKey)!;
	}

	try {
		// Dynamically import the liturgy data for the specific locale using $lib alias
		const symbolFilePath = join(SYMBOL_DIR, getSymbolFileName(locale.code));
		console.log('importing symbolFilePath', symbolFilePath);
		const liturgyData = await import(/* @vite-ignore */ symbolFilePath);

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
	const fileName = getSymbolFileName(liturgy.language_code as LocaleCode);
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
