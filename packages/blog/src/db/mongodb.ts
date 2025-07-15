import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.SECRET_MONGODB_URI;
const DB_NAME = 'logoi';

let client: MongoClient | null = null;

export const getMongoClient = async (): Promise<MongoClient> => {
	if (!client) {
		try {
			if (!MONGODB_URI) {
				throw new Error('MONGODB_URI is not set');
			}

			console.log('Connecting to MongoDB:', MONGODB_URI);
			client = new MongoClient(MONGODB_URI);
			await client.connect();
			console.log('MongoDB connected successfully');
		} catch (error) {
			console.error('MongoDB connection error:', error);
			throw error;
		}
	}
	return client;
};

export const getMongoDb = async () => {
	const client = await getMongoClient();
	return client.db(DB_NAME);
};

export const closeMongoConnection = async () => {
	if (client) {
		await client.close();
		client = null;
	}
};
