import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import type { Locale, LocaleCode } from 'src/routes/liturgy/locale/locale.schema';

// Schema for readings - reuse the same structure as liturgy
const paragraphSchema = z.object({
	type: z.literal('paragraph'),
	by: z.string(),
	text: z.string(),
	cross: z.boolean().optional(),
	lordsSpeech: z.boolean().optional()
});

const sectionSchema = z.object({
	type: z.literal('section'),
	name: z.string(),
	content: z.array(paragraphSchema)
});

const authorSchema = z.object({
	name: z.string(),
	by: z.string()
});

export const readingsSchema = z.object({
	language_code: z.string(),
	title: z.string(),
	author: authorSchema,
	date: z.string(),
	location: z.string(),
	content: z.array(sectionSchema)
});

export type Readings = z.infer<typeof readingsSchema>;

// Cache for different locales
const readingsCache = new Map<string, Readings>();

export function clearReadingsCache() {
	readingsCache.clear();
}

export async function getReadingsData(locale: Locale, date: string): Promise<Readings | null> {
	const cacheKey = `${locale.code}-${date}`;

	// Check if we have cached data for this locale
	if (readingsCache.has(cacheKey)) {
		return readingsCache.get(cacheKey)!;
	}

	try {
		// Construct the path to the readings file
		const readingsPath = join(process.cwd(), 'src', 'data', 'texts', 'readings');
		const filePath = join(readingsPath, `readings.${locale.code}.json`);

		// Read the file
		const fileContent = readFileSync(filePath, 'utf-8');
		const readingsData = JSON.parse(fileContent);

		// Validate the data against our schema
		const parsedReadings = readingsSchema.safeParse(readingsData);

		if (!parsedReadings.success) {
			console.error(
				`Readings data validation failed for locale ${locale.code}:`,
				parsedReadings.error
			);
			return null;
		}

		// Cache the validated data for this locale
		readingsCache.set(cacheKey, parsedReadings.data);

		return parsedReadings.data;
	} catch (error) {
		console.error(`Failed to load readings data for locale ${locale.code}:`, error);
		return null;
	}
}

export async function getReadingsByDate(locale: Locale, date: string): Promise<Readings | null> {
	// For now, return today's readings
	// In the future, this could be extended to fetch readings for specific dates
	return getReadingsData(locale, date);
}

// Helper function to get readings for current date
export async function getTodaysReadings(locale: Locale): Promise<Readings | null> {
	const today = new Date().toISOString().split('T')[0];
	return getReadingsByDate(locale, today);
}
