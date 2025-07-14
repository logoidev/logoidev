import { json } from '@sveltejs/kit';
import { liturgySchema, type Liturgy } from './liturgy/liturgy.schema';
import { clearLiturgyCache, getLiturgyData, writeLiturgyData } from './liturgy/liturgy.server';
import { isAdminFromUrl } from './utils/admin';
import { getLocaleFromUrl } from './locale/locale';
import { getSpeakers } from './speaker/speaker';

export async function GET({ url }: { url: URL }) {
	const locale = getLocaleFromUrl(url);
	const liturgy = await getLiturgyData(locale);
	const speakers = await getSpeakers(locale.code);
	return json({ liturgy, speakers });
}

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

		await writeLiturgyData(liturgy);

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
