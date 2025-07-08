import { z } from 'zod';

// Schema for paragraph content
const paragraphSchema = z.object({
	type: z.literal('paragraph'),
	by: z.string(),
	text: z.string(),
	cross: z.boolean().optional()
});

// Schema for section content
const sectionSchema = z.object({
	type: z.literal('section'),
	name: z.string(),
	content: z.array(paragraphSchema)
});

// Schema for author information
const authorSchema = z.object({
	name: z.string(),
	by: z.string()
});

// Main liturgy schema
export const liturgySchema = z.object({
	language_code: z.string(),
	title: z.string(),
	author: authorSchema,
	date: z.string(),
	location: z.string(),
	content: z.array(sectionSchema)
});

// Type inference
export type Liturgy = z.infer<typeof liturgySchema>;
export type LiturgySection = z.infer<typeof sectionSchema>;
export type LiturgyParagraph = z.infer<typeof paragraphSchema>;
export type LiturgyAuthor = z.infer<typeof authorSchema>;
