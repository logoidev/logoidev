declare module 'openai' {
	export default class OpenAI {
		constructor(config: { apiKey: string; dangerouslyAllowBrowser?: boolean });
		chat: {
			completions: {
				create(params: {
					model: string;
					messages: Array<{ role: string; content: string }>;
					stream?: boolean;
				}): AsyncIterable<{
					choices: Array<{
						delta?: {
							content?: string;
						};
					}>;
				}>;
			};
		};
	}
}
