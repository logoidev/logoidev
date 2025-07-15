<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { alerts } from 'src/lib/stores/alert';
	import LanguageDropdown from 'src/components/LanguageDropdown.svelte';
	import AlertContainer from 'src/components/AlertContainer.svelte';
	import LiturgyView from 'src/components/LiturgyView.svelte';
	import ToggleQR from 'src/components/ToggleQR.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import Header from 'src/components/Header.svelte';
	import { getIndexUrl } from 'src/shared/routes';
	import { liturgyStore, type LiturgyState } from 'src/lib/stores/liturgy';
	import type { Speaker } from './speaker/speaker';
	import type { Locale } from './locale/locale.schema';
	import { LOCALES } from './locale/locale.schema';
	import { getTranslations } from './translations/translations';
	import type { AppData } from './types';

	export let data: AppData;

	$: ({ liturgy, locale, speakers, isAdmin } = data);

	$: console.log('$liturgyStore', data);

	// Get translations for current locale
	$: t = getTranslations(locale.code);

	// Subscribe to store
	// TODO: Fix typescript issue with app being built
	$: storeState = $liturgyStore as LiturgyState;
	$: console.log('Store state:', storeState);

	// Initialize store with data
	onMount(() => {
		console.log('onMount - liturgy:', liturgy, 'speakers:', speakers);
		if (liturgy && speakers) {
			console.log('Initializing store in onMount');
			liturgyStore.initialize(liturgy, speakers, isAdmin);
		}

		// Fallback: if store doesn't initialize within 2 seconds, force it
		setTimeout(() => {
			if (!storeState.liturgy && liturgy && speakers) {
				console.log('Forcing store initialization after timeout');
				liturgyStore.initialize(liturgy, speakers, isAdmin);
			}
		}, 2000);
	});

	// Also initialize when data changes
	$: if (liturgy && speakers && !storeState.liturgy) {
		console.log('Initializing store in reactive statement');
		liturgyStore.initialize(liturgy, speakers, isAdmin);
	}

	// Get speaker info by name
	function getSpeakerInfo(speakerName: string): Speaker | undefined {
		return (storeState.speakers ?? []).find((speaker) => speaker.name === speakerName);
	}

	// Get localized language name
	function getLocalizedLanguageName(languageCode: string): string {
		const locale = LOCALES.find((loc: any) => loc.code === languageCode);
		return locale ? locale.localName : languageCode;
	}

	// Handle locale change
	async function handleLocaleChange(newLocale: Locale) {
		liturgyStore.setLoading(true);

		try {
			// Update URL with new locale
			const url = new URL(window.location.href);
			url.searchParams.set('locale', newLocale.code);
			window.history.pushState({}, '', url.toString());

			// Fetch new liturgy data
			const response = await fetch(`/liturgy?locale=${newLocale.code}`);
			if (!response.ok) {
				throw new Error('Failed to fetch liturgy data');
			}

			const newData = await response.json();

			// Reinitialize store with new data
			liturgyStore.initialize(newData.liturgy, newData.speakers, isAdmin);
		} catch (error) {
			console.error('Error fetching liturgy data:', error);
			// Fallback to page reload if fetch fails
			const fallbackUrl = new URL(window.location.href);
			fallbackUrl.searchParams.set('locale', newLocale.code);
			window.location.href = fallbackUrl.toString();
		} finally {
			liturgyStore.setLoading(false);
		}
	}

	// Toggle admin view
	function toggleAdminView() {
		liturgyStore.toggleAdminView();
	}

	// Save changes
	async function saveChanges() {
		const targetLiturgy = liturgyStore.getTargetLiturgy(storeState);
		if (!targetLiturgy) return;

		try {
			// Show loading state
			liturgyStore.setLoading(true);

			// Get admin code from URL
			const url = new URL(window.location.href);
			const adminCode = url.searchParams.get('code');

			// Call the API to save changes
			const response = await fetch(`/liturgy?code=${adminCode}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(targetLiturgy)
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
			}

			const result = await response.json();

			// Update store with the saved data
			liturgyStore.updateLiturgy(targetLiturgy);
			if (storeState.isAdminView) {
				liturgyStore.updateEditedLiturgy(targetLiturgy);
			}

			// Show success message
			alerts.success(result.message || 'Changes saved successfully!', 'Success');
		} catch (error) {
			console.error('Error saving changes:', error);
			alerts.error(error instanceof Error ? error.message : 'Error saving changes', 'Error');
		} finally {
			liturgyStore.setLoading(false);
		}
	}

	// Reset changes
	function resetChanges() {
		if (liturgy) {
			liturgyStore.resetChanges(liturgy);
			alerts.info('Changes have been reset to original values', 'Reset');
		}
	}

	// Add new paragraph with proper type
	function addParagraph(section: any) {
		const targetLiturgy = liturgyStore.getTargetLiturgy(storeState);
		if (!targetLiturgy) return;

		section.content.push({
			type: 'paragraph',
			by: storeState.allSpeakers[0] || '',
			text: '',
			cross: false
		});

		// Update store
		if (storeState.isAdminView) {
			liturgyStore.updateEditedLiturgy(targetLiturgy);
		} else {
			liturgyStore.updateLiturgy(targetLiturgy);
		}
	}

	// Add new section with proper type
	function addSection() {
		const targetLiturgy = liturgyStore.getTargetLiturgy(storeState);
		if (!targetLiturgy) return;

		targetLiturgy.content.push({
			type: 'section',
			name: 'New Section',
			content: []
		});

		// Update store
		if (storeState.isAdminView) {
			liturgyStore.updateEditedLiturgy(targetLiturgy);
		} else {
			liturgyStore.updateLiturgy(targetLiturgy);
		}
	}

	// Delete section
	function deleteSection(sectionIndex: number) {
		const targetLiturgy = liturgyStore.getTargetLiturgy(storeState);
		if (!targetLiturgy) return;

		targetLiturgy.content.splice(sectionIndex, 1);

		// Update store
		if (storeState.isAdminView) {
			liturgyStore.updateEditedLiturgy(targetLiturgy);
		} else {
			liturgyStore.updateLiturgy(targetLiturgy);
		}
	}

	// Delete paragraph
	function deleteParagraph(section: any, paragraphIndex: number) {
		section.content.splice(paragraphIndex, 1);

		// Update store
		const targetLiturgy = liturgyStore.getTargetLiturgy(storeState);
		if (targetLiturgy) {
			if (storeState.isAdminView) {
				liturgyStore.updateEditedLiturgy(targetLiturgy);
			} else {
				liturgyStore.updateLiturgy(targetLiturgy);
			}
		}
	}

	// Get the current liturgy data to display
	$: displayLiturgy = storeState.liturgy ? liturgyStore.getDisplayLiturgy(storeState) : liturgy;
</script>

<svelte:head>
	<title>{t.pageTitle} - {displayLiturgy?.title || t.loading}</title>
</svelte:head>

<div class="flex w-full mt-6 items-center justify-center text-center">
	<Header class="w-48 text-base" />
</div>

<!-- Alert Container for notifications -->
<AlertContainer />

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<!-- Header with Language Dropdown and Admin Toggle -->
	<div class="mb-6 flex justify-between items-start gap-4">
		<div class="flex-1">
			<LanguageDropdown
				withLabel={false}
				currentLocale={locale}
				onLocaleChange={handleLocaleChange}
			/>
		</div>
		<div class="flex items-center gap-2">
			{#if isAdmin}
				<button
					title={t.adminMode}
					on:click={toggleAdminView}
					class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
					disabled={storeState.isLoading}
				>
					{storeState.isAdminView ? `👁️` : `⚙️`}
				</button>
			{/if}
		</div>
	</div>

	<!-- Loading Indicator -->
	{#if storeState.isLoading || (!displayLiturgy && !liturgy)}
		<div class="text-center py-8">
			<div class="inline-flex items-center gap-2 text-gray-600">
				<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
				<span>{t.loading}</span>
			</div>
		</div>
	{:else if displayLiturgy}
		<!-- Regular View with Inline Editing for Admins -->

		<LiturgyView
			{isAdmin}
			speakers={storeState.speakers}
			isLoading={storeState.isLoading}
			allSpeakers={storeState.allSpeakers}
			onSave={isAdmin ? saveChanges : null}
			onReset={isAdmin ? resetChanges : null}
			onAddParagraph={isAdmin ? addParagraph : null}
			onAddSection={isAdmin ? addSection : null}
			onDeleteParagraph={isAdmin ? deleteParagraph : null}
			onDeleteSection={isAdmin ? deleteSection : null}
			{getSpeakerInfo}
			{getLocalizedLanguageName}
			translations={t}
		/>
	{:else}
		<div class="text-center py-12">
			<div class="text-gray-500 text-lg">{t.loading}</div>
		</div>
	{/if}
</div>

<div class="flex flex-col justify-center items-center font-serif">
	<ToggleQR url={getIndexUrl($page.url.pathname)} text="☦️" rounded animated />

	<Copyright withUkraine={false} />
</div>
