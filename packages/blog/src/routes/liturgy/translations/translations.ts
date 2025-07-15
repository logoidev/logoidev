import type { Translations } from './translations.types';
import type { LocaleCode } from '../locale/locale.schema';

import enTranslations from './ui/ui.en';
import ukTranslations from './ui/ui.uk';
import ruTranslations from './ui/ui.ru';
import grTranslations from './ui/ui.gr';

const translations: Record<LocaleCode, Translations> = {
	en: enTranslations,
	uk: ukTranslations,
	ru: ruTranslations,
	cu: ukTranslations,
	gr: grTranslations
};

// Function to get translations for a locale
export function getTranslations(localeCode: LocaleCode): Translations {
	return translations[localeCode] || translations.en;
}

// Export types for use in components
export type { Translations };
