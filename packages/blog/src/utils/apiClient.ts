import { PUBLIC_OPENAI_API_KEY } from '$env/static/public';
import OpenAI from 'openai';

const client = new OpenAI({
	apiKey: PUBLIC_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true
});

export async function sendMessage(message: string, onData: (chunk: string) => void): Promise<void> {
	try {
		const stream = await client.chat.completions.create({
			model: 'gpt-4',
			messages: [{ role: 'user', content: message }],
			stream: true
		});

		for await (const chunk of stream) {
			const content = chunk.choices[0]?.delta?.content;
			if (content) {
				onData(content);
			}
		}
	} catch (error) {
		console.error('Error sending message:', error);
		onData('Sorry, there was an error processing your request.');
	}
}
