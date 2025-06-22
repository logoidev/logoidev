<script lang="ts">
	import type { Locale, LocaleCode } from '../routes/liturgy/locale/locale.schema';
	import { LOCALES, DEFAULT_LOCALE } from '../routes/liturgy/locale/locale.schema';
	import { getTranslations } from '../routes/liturgy/translations/translations';

	export let currentLocale: Locale = DEFAULT_LOCALE;
	export let onLocaleChange: (locale: Locale) => void = () => {};

	// Get translations for current locale
	$: t = getTranslations(currentLocale.code);

	function handleLocaleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const selectedCode = target.value as LocaleCode;
		const selectedLocale = LOCALES.find((locale) => locale.code === selectedCode);

		if (selectedLocale) {
			onLocaleChange(selectedLocale);
		}
	}
</script>

<div class="min-w-48">
	<label for="language-select" class="block text-sm font-medium text-gray-700 mb-1">
		{t.language}
	</label>
	<select
		id="language-select"
		bind:value={currentLocale.code}
		on:change={handleLocaleChange}
		class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
	>
		{#each LOCALES as locale}
			<option value={locale.code}>
				{locale.localName} ({locale.name})
			</option>
		{/each}
	</select>
</div>
