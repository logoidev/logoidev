import { z } from 'zod';

// Schema for speaker contact information
const contactSchema = z.object({
	email: z.string().email().optional(),
	phone: z.string().optional(),
	website: z.string().url().optional()
});

// Schema for speaker social media
const socialMediaSchema = z.object({
	twitter: z.string().optional(),
	linkedin: z.string().optional(),
	github: z.string().optional(),
	instagram: z.string().optional()
});

// Schema for speaker biography
const biographySchema = z.object({
	short: z.string().max(200),
	long: z.string().optional(),
	education: z.array(z.string()).optional(),
	experience: z.array(z.string()).optional()
});

// Schema for speaker availability
const availabilitySchema = z.object({
	available: z.boolean(),
	preferredTimes: z.array(z.string()).optional(),
	timezone: z.string().optional(),
	notes: z.string().optional()
});

// Main speaker schema
export const speakerSchema = z.object({
	id: z.string(),
	name: z.string(),
	title: z.string().optional(),
	organization: z.string().optional(),
	contact: contactSchema.optional(),
	socialMedia: socialMediaSchema.optional(),
	biography: biographySchema,
	availability: availabilitySchema.optional(),
	languages: z.array(z.string()).optional(),
	topics: z.array(z.string()).optional(),
	image: z.string().optional(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime()
});

// Type inference
export type Speaker = z.infer<typeof speakerSchema>;
export type SpeakerContact = z.infer<typeof contactSchema>;
export type SpeakerSocialMedia = z.infer<typeof socialMediaSchema>;
export type SpeakerBiography = z.infer<typeof biographySchema>;
export type SpeakerAvailability = z.infer<typeof availabilitySchema>;

// Cache for different locales
const speakersCache = new Map<string, Speaker[]>();

// Sample speakers data - can be extended with locale-specific data
const sampleSpeakers: Speaker[] = [
	{
		id: 'priest-1',
		name: 'Priest',
		title: 'Reverend',
		organization: 'Orthodox Church',
		biography: {
			short: 'Ordained priest serving the Orthodox community',
			long: 'Experienced priest with over 20 years of service in the Orthodox Church, specializing in liturgical services and pastoral care.',
			education: ['Theological Seminary', 'Divinity School'],
			experience: ['Parish Priest', 'Liturgical Instructor', 'Spiritual Counselor']
		},
		languages: ['English', 'Ukrainian', 'Greek'],
		topics: ['Liturgy', 'Spirituality', 'Pastoral Care'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: 'deacon-1',
		name: 'Deacon',
		title: 'Deacon',
		organization: 'Orthodox Church',
		biography: {
			short: 'Ordained deacon assisting in liturgical services',
			long: 'Dedicated deacon with extensive experience in liturgical assistance and community service.',
			education: ['Diaconal Training Program'],
			experience: ['Liturgical Assistant', 'Community Outreach']
		},
		languages: ['English', 'Ukrainian'],
		topics: ['Liturgy', 'Community Service'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: 'reader-1',
		name: 'Reader',
		title: 'Lector',
		organization: 'Orthodox Church',
		biography: {
			short: 'Trained reader for liturgical services',
			long: 'Experienced reader with proper training in liturgical reading and chanting.',
			education: ['Reader Training Program'],
			experience: ['Liturgical Reader', 'Choir Member']
		},
		languages: ['English', 'Ukrainian'],
		topics: ['Liturgical Reading', 'Chanting'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: 'choir-1',
		name: 'Choir',
		title: 'Choir Director',
		organization: 'Orthodox Church',
		biography: {
			short: 'Church choir providing liturgical music',
			long: 'Dedicated choir with extensive repertoire of Orthodox liturgical music and hymns.',
			education: ['Music Education', 'Liturgical Music Training'],
			experience: ['Choir Director', 'Liturgical Musician']
		},
		languages: ['English', 'Ukrainian', 'Greek', 'Church Slavonic'],
		topics: ['Liturgical Music', 'Chanting', 'Hymns'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: 'faithful-1',
		name: 'Faithful',
		title: 'Congregation',
		organization: 'Orthodox Church',
		biography: {
			short: 'Members of the faithful congregation',
			long: 'The gathered faithful participating in the liturgical service.',
			education: [],
			experience: ['Liturgical Participation']
		},
		languages: ['English', 'Ukrainian'],
		topics: ['Liturgical Participation', 'Prayer'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	}
];

// Function to get speakers data with locale-aware caching
export const getSpeakers = async (localeCode?: string): Promise<Speaker[]> => {
	const cacheKey = localeCode || 'default';

	// Check if we have cached data for this locale
	if (speakersCache.has(cacheKey)) {
		return speakersCache.get(cacheKey)!;
	}

	try {
		// Try to load locale-specific speaker data
		if (localeCode) {
			try {
				const speakersData = await import(`./data/speakers.${localeCode}.json`);
				const parsedSpeakers = z.array(speakerSchema).safeParse(speakersData.default);

				if (parsedSpeakers.success) {
					speakersCache.set(cacheKey, parsedSpeakers.data);
					return parsedSpeakers.data;
				}
			} catch (error) {
				// If locale-specific data doesn't exist, fall back to default
				console.log(`No locale-specific speakers found for ${localeCode}, using default`);
			}
		}

		// Use default speakers data
		speakersCache.set(cacheKey, sampleSpeakers);
		return sampleSpeakers;
	} catch (error) {
		console.error(`Failed to load speakers data for locale ${localeCode}:`, error);
		// Return default speakers as fallback
		return sampleSpeakers;
	}
};

// Function to get speaker by name
export const getSpeakerByName = async (
	name: string,
	localeCode?: string
): Promise<Speaker | undefined> => {
	const speakers = await getSpeakers(localeCode);
	return speakers.find((speaker) => speaker.name === name);
};

// Function to clear speakers cache
export function clearSpeakersCache(): void {
	speakersCache.clear();
}

// Function to get speakers cache status
export function getSpeakersCacheStatus(): { size: number; keys: string[] } {
	return {
		size: speakersCache.size,
		keys: Array.from(speakersCache.keys())
	};
}
