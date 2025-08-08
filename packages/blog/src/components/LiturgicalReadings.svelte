<script lang="ts">
	import { onMount } from 'svelte';
	import Header from 'src/components/Header.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import ToggleQR from 'src/components/ToggleQR.svelte';
	import LanguageDropdown from 'src/components/LanguageDropdown.svelte';
	import { getIndexUrl } from 'src/shared/routes';
	import { DEFAULT_LOCALE, LOCALES } from 'src/routes/liturgy/locale/locale.schema';
	import type { Locale } from 'src/routes/liturgy/locale/locale.schema';
	import type { Readings } from 'src/routes/api/readings/readings.server';

	let currentDate = new Date();
	let formattedDate = '';
	let readings: Readings | null = null;
	let loading = true;
	let error: string | null = null;
	let locale: Locale = DEFAULT_LOCALE;

	onMount(() => {
		// Get locale from URL or default to English
		const urlParams = new URLSearchParams(window.location.search);
		const localeCode = urlParams.get('locale') || 'en';
		locale = LOCALES.find((l) => l.code === localeCode) || DEFAULT_LOCALE;

		updateDate();
		loadReadings();

		// Update the date every minute
		const interval = setInterval(updateDate, 60000);

		return () => clearInterval(interval);
	});

	function updateDate() {
		currentDate = new Date();
		formattedDate = currentDate.toLocaleDateString(locale.code === 'en' ? 'en-US' : locale.code, {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	async function loadReadings() {
		loading = true;
		error = null;

		try {
			const response = await fetch(`/api/readings?locale=${locale.code}`);

			if (!response.ok) {
				throw new Error(`Failed to load readings: ${response.status}`);
			}

			readings = await response.json();
		} catch (err) {
			console.error('Error loading readings:', err);
			error = err instanceof Error ? err.message : 'Failed to load readings';
			readings = null;
		} finally {
			loading = false;
		}
	}

	// Handle locale change
	async function handleLocaleChange(newLocale: Locale) {
		locale = newLocale;

		// Update URL with new locale
		const url = new URL(window.location.href);
		url.searchParams.set('locale', newLocale.code);
		window.history.pushState({}, '', url.toString());

		// Update date format and reload readings
		updateDate();
		await loadReadings();
	}

	// Get the apostle reading section
	$: apostleSection = readings?.content.find(
		(section) =>
			section.name.toLowerCase().includes('apostle') ||
			section.name.toLowerCase().includes('апостол')
	);

	// Get the gospel reading section
	$: gospelSection = readings?.content.find(
		(section) =>
			section.name.toLowerCase().includes('gospel') ||
			section.name.toLowerCase().includes('евангел')
	);

	// Extract paragraphs from section, excluding liturgical responses
	function extractReadingParagraphs(section: any): any[] {
		if (!section) return [];

		return section.content.filter(
			(p: any) =>
				!p.text.toLowerCase().includes('glory to you') &&
				!p.text.toLowerCase().includes('слава тебе') &&
				!p.text.toLowerCase().includes('читання з') &&
				!p.text.toLowerCase().includes('чтение из') &&
				!p.text.toLowerCase().includes('reading is from') &&
				!p.by.toLowerCase().includes('faithful') &&
				!p.by.toLowerCase().includes('верующие') &&
				!p.by.toLowerCase().includes('віруючі')
		);
	}

	// Extract scripture reference
	function extractReference(section: any): string {
		if (!section) return '';

		const refParagraph = section.content.find(
			(p: any) => /\d+:\d+(-\d+)?/.test(p.text) && p.text.length < 50
		);

		return refParagraph ? refParagraph.text : '';
	}
</script>

<svelte:head>
	<title>Liturgical Calendar - Daily Readings</title>
</svelte:head>

<div class="flex w-full mt-6 items-center justify-center text-center">
	<Header class="w-48 text-base" />
</div>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<!-- Language Dropdown -->
	<div class="mb-6 flex justify-center">
		<LanguageDropdown
			withLabel={false}
			currentLocale={locale}
			onLocaleChange={handleLocaleChange}
		/>
	</div>

	<!-- Header Section -->
	<div class="text-center mb-8">
		<h1 class="text-3xl font-trajan font-bold text-gray-800 mb-2">
			{readings?.title || 'Daily Readings'}
		</h1>
		<p class="text-xl text-gray-600 mb-1 font-trajan">{formattedDate}</p>
	</div>

	{#if loading}
		<div class="text-center py-8">
			<div class="inline-flex items-center gap-2 text-gray-600">
				<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
				<span class="font-serif">Loading readings...</span>
			</div>
		</div>
	{:else if error}
		<div class="text-center py-8">
			<div class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
				<div class="flex items-center mb-2">
					<svg
						class="h-6 w-6 text-red-500 mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h3 class="text-lg font-medium text-red-700">Error</h3>
				</div>
				<p class="text-red-700">{error}</p>
				<button
					class="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
					on:click={loadReadings}
				>
					Try Again
				</button>
			</div>
		</div>
	{:else if readings && apostleSection && gospelSection}
		<div class="space-y-8">
			<!-- Apostle Reading -->
			<section class="bg-white rounded-lg shadow-md px-6 py-8 border border-blue-200">
				<div class="flex items-center justify-center mb-6">
					<h2 class="text-2xl font-serif font-semibold text-gray-800 text-center">
						{apostleSection.name}
					</h2>
				</div>

				<div class="text-center mb-6">
					<p class="text-blue-800 font-medium font-serif text-lg">
						{extractReference(apostleSection)}
					</p>
				</div>

				<div class="prose prose-lg mx-auto font-serif leading-relaxed text-justify">
					{#each extractReadingParagraphs(apostleSection) as paragraph}
						<p class="mb-4 text-gray-700 {paragraph.lordsSpeech ? 'text-red-700' : ''}">
							{paragraph.text}
						</p>
					{/each}
				</div>
			</section>

			<!-- Gospel Reading -->
			<section class="bg-white rounded-lg shadow-md px-6 py-8 border border-red-200">
				<div class="flex items-center justify-center mb-6">
					<h2 class="text-2xl font-serif font-semibold text-gray-800 text-center">
						{gospelSection.name}
					</h2>
				</div>

				<div class="text-center mb-6">
					<p class="text-red-800 font-medium font-serif text-lg">
						{extractReference(gospelSection)}
					</p>
				</div>

				<div class="prose prose-lg mx-auto font-serif leading-relaxed text-justify">
					{#each extractReadingParagraphs(gospelSection) as paragraph}
						<p class="mb-4 text-gray-700 {paragraph.lordsSpeech ? 'text-red-700' : ''}">
							{paragraph.text}
						</p>
					{/each}
				</div>
			</section>
		</div>
	{:else}
		<div class="text-center py-12">
			<div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
				<p class="text-gray-500 text-lg font-serif">No readings available for today.</p>
			</div>
		</div>
	{/if}
</div>

<div class="flex flex-col justify-center items-center font-serif">
	<ToggleQR url={getIndexUrl('/calendar')} text="☦️" rounded animated />

	<Copyright withUkraine={false} />
</div>

<style>
	.prose {
		max-width: 65ch;
		font-family: var(--font-serif, serif);
		line-height: 1.7;
	}
</style>
