export const estimateMinutesToRead = (text: string, wpm = 200) => {
	const words = text.split(' ');
	const wordCount = words.length / wpm;
	const minutes = Math.round(wordCount);
	return minutes;
};
