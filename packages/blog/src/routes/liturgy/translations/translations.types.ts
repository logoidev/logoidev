// Translation interface
export interface Translations {
	// Page titles and headers
	pageTitle: string;
	adminMode: string;
	viewMode: string;

	// Admin interface
	adminModeDescription: string;
	save: string;
	reset: string;

	// Form labels
	title: string;
	language: string;
	date: string;
	location: string;
	authorName: string;
	authorBy: string;
	authorByLabel: string;
	sectionName: string;
	speaker: string;
	text: string;
	hasCross: string;

	// Actions
	addParagraph: string;
	addNewSection: string;
	deleteSection: string;
	delete: string;
	customSpeaker: string;
	enterCustomSpeaker: string;

	// Display labels
	languageLabel: string;
	authorLabel: string;
	dateLabel: string;
	locationLabel: string;

	// Raw JSON
	viewRawJson: string;
	viewRawJsonAdmin: string;

	// Loading
	loading: string;

	// Error handling
	error: string;
	tryAgain: string;
}
