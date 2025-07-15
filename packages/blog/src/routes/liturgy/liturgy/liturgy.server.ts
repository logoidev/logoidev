import { type Liturgy, liturgySchema } from './liturgy.schema';
import type { Locale, LocaleCode } from '../locale/locale.schema';
import { getMongoClient } from 'src/db/mongodb';
import { z } from 'zod';

const genericMongoFieldsSchema = z.object({
	_id: z.object({}),
	created_at: z.date(),
	updated_at: z.date()
});

const liturgySchemaWithGenericFields = liturgySchema.extend(genericMongoFieldsSchema.shape);

// Cache for different locales
const liturgyCache = new Map<string, Liturgy>();

export async function getLiturgyData(locale: Locale): Promise<Liturgy | null> {
	const cacheKey = locale.code;

	// Check if we have cached data for this locale
	if (liturgyCache.has(cacheKey)) {
		return liturgyCache.get(cacheKey)!;
	}

	try {
		const client = await getMongoClient();
		const collection = client.db('logoi').collection('liturgies');

		// Read from MongoDB with projection to get JSON directly
		const liturgyData = await collection.findOne({ language_code: locale.code });

		if (!liturgyData) {
			console.error(`No liturgy data found for locale ${locale.code}`);
			return null;
		}

		// Validate the data against our schema
		const parsedLiturgy = liturgySchemaWithGenericFields.safeParse(liturgyData);

		if (!parsedLiturgy.success) {
			console.error(
				`Liturgy data validation failed for locale ${locale.code}:`,
				parsedLiturgy.error
			);
			console.error(`Raw data that failed validation:`, liturgyData);
			return null;
		}

		// Cache the validated data for this locale
		liturgyCache.set(cacheKey, parsedLiturgy.data);

		return parsedLiturgy.data;
	} catch (error) {
		clearLiturgyCache();
		console.error(`Failed to load liturgy data for locale ${locale.code}:`, error);
		throw error;
	}
}

export async function writeLiturgyData(liturgy: Liturgy): Promise<void> {
	try {
		const client = await getMongoClient();
		const collection = client.db('logoi').collection('liturgies');

		// Upsert the liturgy data
		await collection.updateOne(
			{ language_code: liturgy.language_code },
			{ $set: liturgy },
			{ upsert: true }
		);

		// Clear the cache for this locale
		liturgyCache.delete(liturgy.language_code as LocaleCode);
	} catch (error) {
		console.error('Failed to write liturgy data:', error);
		throw error;
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
