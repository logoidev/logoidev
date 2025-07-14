import type { LocaleCode } from '../locale/locale.schema';

// Translation interface
interface Translations {
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
}

// English translations
const enTranslations: Translations = {
	pageTitle: 'Liturgy',
	adminMode: 'Admin Mode',
	viewMode: 'View Mode',
	adminModeDescription:
		'You are in admin mode. You can edit the liturgy content below. Changes will be saved when you click "Save".',
	save: 'Save',
	reset: 'Reset',
	title: 'Title',
	language: 'Language',
	date: 'Date',
	location: 'Location',
	authorName: 'Author Name',
	authorBy: 'Author By',
	sectionName: 'Section Name',
	speaker: 'Speaker (by)',
	text: 'Text',
	hasCross: 'Has cross (✝)',
	addParagraph: 'Add Paragraph',
	addNewSection: 'Add New Section',
	deleteSection: 'Delete Section',
	delete: 'Delete',
	customSpeaker: 'Custom Speaker',
	enterCustomSpeaker: 'Enter custom speaker name',
	languageLabel: 'Language:',
	authorLabel: 'Author:',
	authorByLabel: 'Author By:',
	dateLabel: 'Date:',
	locationLabel: 'Location:',
	viewRawJson: 'View Raw JSON Data',
	viewRawJsonAdmin: 'View Raw JSON Data (Admin Only)',
	loading: 'Loading liturgy data...'
};

// Ukrainian translations
const ukTranslations: Translations = {
	pageTitle: 'Літургія',
	adminMode: 'Режим Адміністратора',
	viewMode: 'Режим Перегляду',
	adminModeDescription:
		'Ви знаходитесь в режимі адміністратора. Ви можете редагувати вміст літургії нижче. Зміни будуть збережені, коли ви натиснете "Зберегти".',
	save: 'Зберегти',
	reset: 'Скинути',
	title: 'Заголовок',
	language: 'Мова',
	date: 'Дата',
	location: 'Місце',
	authorName: "Ім'я Автора",
	authorBy: 'Автор',
	sectionName: 'Назва Розділу',
	speaker: 'Промовець (від)',
	text: 'Текст',
	hasCross: 'Знак хреста (☦)',
	addParagraph: 'Додати Параграф',
	addNewSection: 'Додати Новий Розділ',
	deleteSection: 'Видалити Розділ',
	delete: 'Видалити',
	customSpeaker: 'Власний Промовець',
	enterCustomSpeaker: "Введіть ім'я власного промовця",
	languageLabel: 'Мова:',
	authorLabel: 'Автор:',
	authorByLabel: 'Авторa:',
	dateLabel: 'Дата:',
	locationLabel: 'Місце:',
	viewRawJson: 'Переглянути Необроблені JSON Дані',
	viewRawJsonAdmin: 'Переглянути Необроблені JSON Дані (Тільки для Адміністраторів)',
	loading: 'Завантаження даних літургії...'
};

const ruTranslations: Translations = {
	pageTitle: 'Литургия',
	adminMode: 'Режим администратора',
	viewMode: 'Режим просмотра',
	adminModeDescription:
		'Вы находитесь в режиме администратора. Вы можете редактировать содержимое ниже. Изменения будут сохранены при нажатии "Сохранить".',
	save: 'Сохранить',
	reset: 'Сбросить',
	title: 'Заголовок',
	language: 'Язык',
	date: 'Дата',
	location: 'Место',
	authorName: 'Имя автора',
	authorBy: 'Автор',
	sectionName: 'Название раздела',
	speaker: 'Проповедник (от)',
	text: 'Текст',
	hasCross: 'Знак креста (✝)',
	addParagraph: 'Добавить абзац',
	addNewSection: 'Добавить новый раздел',
	deleteSection: 'Удалить раздел',
	delete: 'Удалить',
	customSpeaker: 'Особый чтец',
	enterCustomSpeaker: 'Введите имя чтеца',
	languageLabel: 'Язык',
	authorLabel: 'Автор',
	authorByLabel: 'Автор',
	dateLabel: 'Дата',
	locationLabel: 'Место',
	viewRawJson: 'Просмотреть не обработанные JSON данные',
	viewRawJsonAdmin: 'Просмотреть не обработанные JSON данные (только для администраторов)',
	loading: 'Загрузка данных литургии...'
};

// Translation map
const translations: Record<LocaleCode, Translations> = {
	en: enTranslations,
	uk: ukTranslations,
	ru: ruTranslations,
	cu: ukTranslations
};

// Function to get translations for a locale
export function getTranslations(localeCode: LocaleCode): Translations {
	return translations[localeCode] || translations.en;
}

// Export types for use in components
export type { Translations };
