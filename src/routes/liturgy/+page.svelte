<script lang="ts">
	import type { Liturgy } from './liturgy/liturgy.schema';
	import type { Speaker } from './speaker/speaker';
	import type { Locale } from './locale/locale.schema';
	import { LOCALES } from './locale/locale.schema';
	import type { Translations } from './translations/translations';
	import { getTranslations } from './translations/translations';
	import LanguageDropdown from '../../components/LanguageDropdown.svelte';

	export let data;

	$: ({ liturgy, locale, speakers } = data);

	$: console.log(liturgy, locale, speakers);

	// Get translations for current locale
	$: t = getTranslations(locale.code);

	// Admin state
	let isAdminView = false;
	let editedLiturgy: Liturgy | null = null;
	let currentLiturgy: Liturgy | null = null;
	let currentSpeakers: Speaker[] | null = null;
	let isLoading = false;

	// Initialize current data
	$: if (liturgy && !currentLiturgy) {
		currentLiturgy = liturgy;
	}
	$: if (speakers && !currentSpeakers) {
		currentSpeakers = speakers;
	}

	// Extract unique speakers from liturgy data
	$: uniqueSpeakers = currentLiturgy
		? [
				...new Set(
					currentLiturgy.content.flatMap((section) =>
						section.content.map((paragraph) => paragraph.by)
					)
				)
			].sort()
		: [];

	// Common liturgical speakers
	const commonSpeakers = [
		'Priest',
		'Deacon',
		'Faithful',
		'Choir',
		'Reader',
		'All',
		'People',
		'Congregation'
	];

	// Combine existing speakers with common ones, removing duplicates
	$: allSpeakers = currentLiturgy
		? [...new Set([...commonSpeakers, ...uniqueSpeakers])].sort()
		: commonSpeakers;

	// Get speaker info by name
	function getSpeakerInfo(speakerName: string): Speaker | undefined {
		return currentSpeakers?.find((speaker) => speaker.name === speakerName);
	}

	// Get localized language name
	function getLocalizedLanguageName(languageCode: string): string {
		const locale = LOCALES.find((loc: any) => loc.code === languageCode);
		return locale ? locale.localName : languageCode;
	}

	// Handle locale change
	async function handleLocaleChange(newLocale: Locale) {
		isLoading = true;

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
			currentLiturgy = newData.liturgy;
			currentSpeakers = newData.speakers;

			// Reset admin state if in admin mode
			if (isAdminView && currentLiturgy) {
				editedLiturgy = JSON.parse(JSON.stringify(currentLiturgy));
			}
		} catch (error) {
			console.error('Error fetching liturgy data:', error);
			// Fallback to page reload if fetch fails
			const fallbackUrl = new URL(window.location.href);
			fallbackUrl.searchParams.set('locale', newLocale.code);
			window.location.href = fallbackUrl.toString();
		} finally {
			isLoading = false;
		}
	}

	// Toggle admin view
	function toggleAdminView() {
		isAdminView = !isAdminView;
		if (isAdminView && currentLiturgy) {
			editedLiturgy = JSON.parse(JSON.stringify(currentLiturgy)); // Deep copy
		}
	}

	// Save changes
	async function saveChanges() {
		if (!editedLiturgy) return;

		try {
			// Here you would typically send the data to your server
			// For now, we'll just update the local state
			console.log('Saving liturgy changes:', editedLiturgy);

			// You could add an API call here:
			// const response = await fetch('/api/liturgy', {
			//     method: 'PUT',
			//     headers: { 'Content-Type': 'application/json' },
			//     body: JSON.stringify(editedLiturgy)
			// });

			alert('Changes saved successfully!');
		} catch (error) {
			console.error('Error saving changes:', error);
			alert('Error saving changes');
		}
	}

	// Reset changes
	function resetChanges() {
		if (currentLiturgy) {
			editedLiturgy = JSON.parse(JSON.stringify(currentLiturgy));
		}
	}

	// Add new paragraph with proper type
	function addParagraph(section: any) {
		if (!editedLiturgy) return;
		section.content.push({
			type: 'paragraph',
			by: allSpeakers[0] || '',
			text: '',
			cross: false
		});
	}

	// Add new section with proper type
	function addSection() {
		if (!editedLiturgy) return;
		editedLiturgy.content.push({
			type: 'section',
			name: 'New Section',
			content: []
		});
	}

	// Delete section
	function deleteSection(sectionIndex: number) {
		if (!editedLiturgy) return;
		editedLiturgy.content.splice(sectionIndex, 1);
	}

	// Delete paragraph
	function deleteParagraph(section: any, paragraphIndex: number) {
		section.content.splice(paragraphIndex, 1);
	}
</script>

<svelte:head>
	<title>{t.pageTitle} - {currentLiturgy?.title || t.loading}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<!-- Header with Language Dropdown and Admin Toggle -->
	<div class="mb-6 flex justify-between items-start gap-4">
		<div class="flex-1">
			<LanguageDropdown currentLocale={locale} onLocaleChange={handleLocaleChange} />
		</div>
		<button
			on:click={toggleAdminView}
			class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
			disabled={isLoading}
		>
			{isAdminView ? `👁️ ${t.viewMode}` : `⚙️ ${t.adminMode}`}
		</button>
	</div>

	<!-- Loading Indicator -->
	{#if isLoading}
		<div class="text-center py-8">
			<div class="inline-flex items-center gap-2 text-gray-600">
				<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
				<span>{t.loading}</span>
			</div>
		</div>
	{:else if currentLiturgy}
		{#if isAdminView}
			<!-- Admin View -->
			<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
				<div class="flex items-center gap-2 mb-4">
					<span title={t.adminMode} class="text-yellow-800 font-semibold">🔧</span>
					<div class="flex gap-2">
						<button
							on:click={saveChanges}
							class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
						>
							💾 {t.save}
						</button>
						<button
							on:click={resetChanges}
							class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
						>
							🔄 {t.reset}
						</button>
					</div>
				</div>
				<p class="text-yellow-700 text-sm">
					{t.adminModeDescription}
				</p>
			</div>

			{#if editedLiturgy}
				<!-- Editable Admin Interface -->
				<div class="space-y-6">
					<!-- Basic Info -->
					<section class="bg-white rounded-lg shadow-md p-6">
						<h2 class="text-2xl font-semibold text-gray-800 mb-4">Basic Information</h2>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">{t.title}</label>
								<input
									bind:value={editedLiturgy.title}
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">{t.language}</label>
								<input
									bind:value={editedLiturgy.language_code}
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">{t.date}</label>
								<input
									bind:value={editedLiturgy.date}
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">{t.location}</label>
								<input
									bind:value={editedLiturgy.location}
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						<div class="mt-4">
							<label class="block text-sm font-medium text-gray-700 mb-1">{t.authorName}</label>
							<input
								bind:value={editedLiturgy.author.name}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div class="mt-4">
							<label class="block text-sm font-medium text-gray-700 mb-1">{t.authorBy}</label>
							<input
								bind:value={editedLiturgy.author.by}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</section>

					<!-- Content Sections -->
					{#each editedLiturgy.content as section, sectionIndex}
						<section class="bg-white rounded-lg shadow-md p-6">
							<div class="flex items-center justify-between mb-4">
								<h2 class="text-2xl font-semibold text-gray-800">Section: {section.name}</h2>
								<button
									on:click={() => deleteSection(sectionIndex)}
									class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
								>
									🗑️ {t.deleteSection}
								</button>
							</div>

							<div class="mb-4">
								<label class="block text-sm font-medium text-gray-700 mb-1">{t.sectionName}</label>
								<input
									bind:value={section.name}
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div class="space-y-4">
								{#each section.content as paragraph, paragraphIndex}
									<div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
										<div class="flex items-start gap-3">
											<div class="flex-1 space-y-3">
												<div>
													<label class="block text-sm font-medium text-gray-700 mb-1"
														>{t.speaker}</label
													>
													<select
														bind:value={paragraph.by}
														class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
													>
														{#each allSpeakers as speaker}
															<option value={speaker}>{speaker}</option>
														{/each}
														<option value="">-- {t.customSpeaker} --</option>
													</select>
													{#if paragraph.by === ''}
														<input
															bind:value={paragraph.by}
															placeholder={t.enterCustomSpeaker}
															class="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
														/>
													{/if}

													<!-- Speaker Information Display -->
													{#if paragraph.by && paragraph.by !== ''}
														{@const speakerInfo = getSpeakerInfo(paragraph.by)}
														{#if speakerInfo}
															<div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
																<div class="flex items-start gap-3">
																	{#if speakerInfo.image}
																		<img
																			src={speakerInfo.image}
																			alt={speakerInfo.name}
																			class="w-12 h-12 rounded-full object-cover"
																		/>
																	{/if}
																	<div class="flex-1">
																		<div class="flex items-center gap-2 mb-1">
																			<h4 class="font-semibold text-blue-900">
																				{speakerInfo.name}
																			</h4>
																			{#if speakerInfo.title}
																				<span
																					class="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded"
																				>
																					{speakerInfo.title}
																				</span>
																			{/if}
																		</div>
																		{#if speakerInfo.organization}
																			<p class="text-sm text-blue-700 mb-2">
																				{speakerInfo.organization}
																			</p>
																		{/if}
																		<p class="text-sm text-blue-800">
																			{speakerInfo.biography.short}
																		</p>
																		{#if speakerInfo.languages && speakerInfo.languages.length > 0}
																			<div class="mt-2">
																				<span class="text-xs text-blue-600 font-medium"
																					>Languages:</span
																				>
																				<span class="text-xs text-blue-700 ml-1">
																					{speakerInfo.languages.join(', ')}
																				</span>
																			</div>
																		{/if}
																		{#if speakerInfo.topics && speakerInfo.topics.length > 0}
																			<div class="mt-1">
																				<span class="text-xs text-blue-600 font-medium"
																					>Topics:</span
																				>
																				<span class="text-xs text-blue-700 ml-1">
																					{speakerInfo.topics.join(', ')}
																				</span>
																			</div>
																		{/if}
																	</div>
																</div>
															</div>
														{:else}
															<div class="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
																<p class="text-sm text-gray-600">
																	<span class="font-medium">{paragraph.by}</span> - {t.customSpeaker}
																</p>
															</div>
														{/if}
													{/if}
												</div>
												<div>
													<label class="block text-sm font-medium text-gray-700 mb-1"
														>{t.text}</label
													>
													<textarea
														bind:value={paragraph.text}
														rows="3"
														class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
													></textarea>
												</div>
												<div class="flex items-center gap-4">
													<label class="flex items-center gap-2">
														<input type="checkbox" bind:checked={paragraph.cross} class="rounded" />
														<span class="text-sm text-gray-700">{t.hasCross}</span>
													</label>
													<button
														on:click={() => deleteParagraph(section, paragraphIndex)}
														class="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
													>
														🗑️ {t.delete}
													</button>
												</div>
											</div>
										</div>
									</div>
								{/each}

								<button
									on:click={() => addParagraph(section)}
									class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
								>
									➕ {t.addParagraph}
								</button>
							</div>
						</section>
					{/each}

					<!-- Add New Section -->
					<button
						on:click={addSection}
						class="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
					>
						➕ {t.addNewSection}
					</button>

					<!-- Raw JSON Display - Admin Only -->
					<details class="mt-12">
						<summary
							class="cursor-pointer text-lg font-semibold text-gray-700 hover:text-gray-900 mb-4"
						>
							📄 {t.viewRawJsonAdmin}
						</summary>
						<pre
							class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">{JSON.stringify(
								editedLiturgy,
								null,
								2
							)}</pre>
					</details>
				</div>
			{/if}
		{:else}
			<!-- Regular View -->
			<header class="mb-8">
				<h1 class="text-3xl font-bold text-gray-900 mb-2">{currentLiturgy.title}</h1>
				<div class="text-gray-600 space-y-1">
					<p>
						<strong>{t.languageLabel}</strong>
						{getLocalizedLanguageName(currentLiturgy.language_code)}
					</p>
					<p>
						<strong>{t.authorLabel}</strong>
						{currentLiturgy.author.name} ({currentLiturgy.author.by})
					</p>
					<p><strong>{t.dateLabel}</strong> {currentLiturgy.date}</p>
					<p><strong>{t.locationLabel}</strong> {currentLiturgy.location}</p>
				</div>
			</header>

			<main class="space-y-8">
				{#each currentLiturgy.content as section}
					<section class="bg-white rounded-lg shadow-md p-6">
						<h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
							{section.name}
						</h2>

						<div class="space-y-4">
							{#each section.content as paragraph}
								{@const speakerInfo = getSpeakerInfo(paragraph.by)}
								<div
									class="bg-gray-50 rounded-lg p-4 {paragraph.cross
										? 'border-l-4 border-blue-500'
										: ''}"
								>
									<div class="flex items-start gap-3">
										{#if paragraph.cross}
											<div class="text-blue-600 text-lg mt-1">✝</div>
										{/if}
										<div class="flex-1">
											<div class="flex items-center gap-2 mb-2">
												<p class="text-sm text-gray-500 font-medium">
													{paragraph.by}
												</p>
												{#if speakerInfo?.title}
													<span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
														{speakerInfo.title}
													</span>
												{/if}
												{#if speakerInfo?.organization}
													<span class="text-xs text-gray-400">
														• {speakerInfo.organization}
													</span>
												{/if}
											</div>
											<p class="text-gray-800 leading-relaxed">
												{paragraph.text}
											</p>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</section>
				{/each}
			</main>
		{/if}
	{:else}
		<div class="text-center py-12">
			<div class="text-gray-500 text-lg">{t.loading}</div>
		</div>
	{/if}
</div>
