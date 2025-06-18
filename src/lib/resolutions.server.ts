import { readFileSync } from 'fs';
import { join } from 'path';

const getResolutionFilePath = (id: string) => {
	return join(process.cwd(), `docs/corporation/projects/mainframe/board-resolutions/${id}.md`);
};

export const getResolutionContent = (id: string) => {
	const filePath = getResolutionFilePath(id);
	const content = readFileSync(filePath, 'utf-8');
	return content;
};
