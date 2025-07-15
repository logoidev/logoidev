import { getMongoDb, closeMongoConnection } from 'src/db/mongodb';
import { readFileSync } from 'fs';
import { join } from 'path';
import { LOCALES } from 'src/routes/liturgy/locale/locale.schema';

async function populateLiturgiesToMongoDB() {
	try {
		console.log('Populating liturgies to MongoDB');
		const db = await getMongoDb();
		const collection = db.collection('liturgies');

		// First, drop the existing collection to ensure clean data
		await collection.drop().catch(() => console.log('Collection did not exist, creating new'));

		// Create indexes
		await collection.createIndex({ language_code: 1 }, { unique: true });

		// Read and process each language file

		const symbolsPath = join(process.cwd(), 'src', 'data', 'texts', 'symbol');

		for (const locale of LOCALES) {
			const filePath = join(symbolsPath, `symbol.${locale.code}.json`);
			const fileContent = readFileSync(filePath, 'utf-8');
			const symbolData = JSON.parse(fileContent);

			await collection.insertOne({
				...symbolData,
				created_at: new Date(),
				updated_at: new Date()
			});

			console.log(`Inserted symbol data for language: ${locale.code}`);
		}

		console.log('Successfully populated all symbol data to MongoDB');
	} catch (error) {
		console.error('Error populating liturgies to MongoDB:', error);
		throw error;
	} finally {
		await closeMongoConnection();
	}
}

// Run the population
populateLiturgiesToMongoDB();
