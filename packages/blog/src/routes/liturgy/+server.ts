import { json } from '@sveltejs/kit';
import { liturgySchema, type Liturgy } from './liturgy/liturgy.schema';
import { clearLiturgyCache } from './liturgy/liturgy';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { isAdminFromUrl } from './utils/admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function PUT({ request, url }: { request: Request; url: URL }) {
	try {
		// Check admin authentication using utility function
		const isAdmin = isAdminFromUrl(url);
		if (!isAdmin) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Parse request body
		const body = await request.json();

		// Validate liturgy data against schema
		const validationResult = liturgySchema.safeParse(body);
		if (!validationResult.success) {
			return json(
				{
					error: 'Invalid liturgy data',
					details: validationResult.error.errors
				},
				{ status: 400 }
			);
		}

		const liturgy: Liturgy = validationResult.data;

		// Determine file path based on language code
		const dataDir = join(__dirname, 'liturgy', 'data');
		const fileName = `liturgy.${liturgy.language_code}.json`;
		const filePath = join(dataDir, fileName);

		// Ensure data directory exists
		await mkdir(dataDir, { recursive: true });

		// Write the updated liturgy data to file
		await writeFile(filePath, JSON.stringify(liturgy, null, 2), 'utf-8');

		// Clear the cache for this locale to ensure fresh data
		clearLiturgyCache();

		return json({
			success: true,
			message: 'Liturgy updated successfully',
			language_code: liturgy.language_code
		});
	} catch (error) {
		console.error('Error updating liturgy:', error);
		return json(
			{
				error: 'Internal server error',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
}
