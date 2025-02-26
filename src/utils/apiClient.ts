import { PUBLIC_OPENAI_API_KEY } from '$env/static/public';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = PUBLIC_OPENAI_API_KEY;

export async function sendMessage(message: string, onData: (chunk: string) => void): Promise<void> {
	try {
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'openai/gpt-4o',
				messages: [{ role: 'user', content: message }],
				stream: true
			})
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error('Response body is not readable');
		}

		const decoder = new TextDecoder();
		let buffer = '';

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });

				while (buffer.includes('\n')) {
					const lineEnd = buffer.indexOf('\n');
					const line = buffer.slice(0, lineEnd).trim();
					buffer = buffer.slice(lineEnd + 1);

					if (line.startsWith('data: ')) {
						const data = line.slice(6);
						if (data === '[DONE]') return;

						try {
							const parsed = JSON.parse(data);
							const content = parsed.choices[0].delta.content;
							if (content) {
								onData(content);
							}
						} catch (e) {
							// Ignore invalid JSON
						}
					}
				}
			}
		} finally {
			reader.cancel();
		}
	} catch (error) {
		console.error('Error sending message:', error);
		onData('Sorry, there was an error processing your request.');
	}
}
