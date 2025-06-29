<script lang="ts">
	import type { Liturgy } from '../routes/liturgy/liturgy/liturgy.schema';
	import type { Speaker } from '../routes/liturgy/speaker/speaker';
	import InlineEditable from './InlineEditable.svelte';
	import { liturgyStore } from '../lib/stores/liturgy';
	import { cn } from 'src/lib/utility/cn';

	export let liturgy: Liturgy;
	export let speakers: Speaker[];
	export let isAdmin: boolean = false;
	export let isLoading: boolean = false;
	export let allSpeakers: string[] = [];
	export let onSave: (() => void) | null = null;
	export let onReset: (() => void) | null = null;
	export let onAddParagraph: ((section: any) => void) | null = null;
	export let onAddSection: (() => void) | null = null;
	export let onDeleteParagraph: ((section: any, paragraphIndex: number) => void) | null = null;
	export let onDeleteSection: ((sectionIndex: number) => void) | null = null;
	export let getSpeakerInfo: ((speakerName: string) => Speaker | undefined) | null = null;
	export let getLocalizedLanguageName: ((languageCode: string) => string) | null = null;
	export let translations: any = {};

	let isInline = true;

	// Subscribe to store
	$: storeState = $liturgyStore;
	$: displayLiturgy = liturgyStore.getDisplayLiturgy(storeState, {
		isInline
	});

	// Helper function to get speaker info
	function getSpeaker(speakerName: string): Speaker | undefined {
		return getSpeakerInfo
			? getSpeakerInfo(speakerName)
			: speakers.find((s) => s.name === speakerName);
	}

	// Handle inline editing updates
	function updateLiturgyData(newLiturgy: Liturgy) {
		if (storeState.isAdminView) {
			liturgyStore.updateEditedLiturgy(newLiturgy);
		} else {
			liturgyStore.updateLiturgy(newLiturgy);
		}
	}
</script>

<!-- Save button for inline editing -->
{#if isAdmin && storeState.isAdminView}
	<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
		<div class="flex items-center gap-2 mb-2">
			<span class="text-blue-800 font-semibold">✏️</span>
			<div class="flex gap-2">
				<button
					on:click={onSave}
					disabled={isLoading}
					class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
				>
					{#if isLoading}
						<div class="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
					{:else}
						💾
					{/if}
					{isLoading ? translations.saving : translations.save}
				</button>
				{#if onReset}
					<button
						on:click={onReset}
						disabled={isLoading}
						class="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						🔄 {translations.reset}
					</button>
				{/if}
			</div>
		</div>

		<p class="text-blue-700 text-sm">
			You can click on any text to edit it inline. Changes will be saved when you click "Save".
		</p>
	</div>

	<button
		class="text-sm text-gray-500 font-medium border border-gray-300 rounded-md px-2 py-1"
		on:click={() => (isInline = !isInline)}
		aria-label="Toggle inline editing"
	>
		{isInline ? '📝 Prose' : '📖 Inline'}
	</button>
{/if}

{#if displayLiturgy}
	<header class="mb-2">
		{#if isAdmin}
			<InlineEditable
				id="liturgy-title"
				editable={isAdmin && storeState.isAdminView}
				label={translations.titleLabel}
				bind:value={displayLiturgy.title}
				disabled={isLoading}
				class={cn('text-3xl font-bold mb-2 block text-center font-pomorsky text-red-800')}
				placeholder="Enter liturgy title..."
				on:change={() => updateLiturgyData(displayLiturgy)}
			/>
		{:else}
			<h1 class="text-3xl font-bold text-gray-900 mb-2 text-center">
				{displayLiturgy.title}
			</h1>
		{/if}

		{#if isAdmin && storeState.isAdminView}
			<div class="text-gray-600 space-y-1">
				<p>
					<InlineEditable
						id="liturgy-language"
						editable={isAdmin && storeState.isAdminView}
						label={translations.languageLabel}
						placeholder={translations.languageLabel}
						bind:value={displayLiturgy.language_code}
						displayValue={getLocalizedLanguageName?.(displayLiturgy.language_code) ??
							displayLiturgy.language_code}
						disabled={isLoading}
						class="inline"
						on:change={() => updateLiturgyData(displayLiturgy)}
					/>
				</p>

				<p>
					<InlineEditable
						id="author-name"
						editable={isAdmin && storeState.isAdminView}
						label={translations.authorLabel}
						bind:value={displayLiturgy.author.name}
						disabled={isLoading}
						class="inline"
						placeholder="Author name"
						on:change={() => updateLiturgyData(displayLiturgy)}
					/>
				</p>
				<p>
					<InlineEditable
						id="author-by"
						class="inline"
						editable={isAdmin && storeState.isAdminView}
						label={translations.authorByLabel}
						bind:value={displayLiturgy.author.by}
						disabled={isLoading}
						placeholder={translations.authorByLabel}
						on:change={() => updateLiturgyData(displayLiturgy)}
					/>
				</p>

				<p>
					<InlineEditable
						id="liturgy-date"
						editable={isAdmin && storeState.isAdminView}
						label={translations.dateLabel}
						bind:value={displayLiturgy.date}
						disabled={isLoading}
						class="inline"
						placeholder="Date"
						on:change={() => updateLiturgyData(displayLiturgy)}
					/>
				</p>

				<p>
					<InlineEditable
						editable={isAdmin && storeState.isAdminView}
						id="liturgy-location"
						label={translations.locationLabel}
						bind:value={displayLiturgy.location}
						disabled={isLoading}
						class="inline"
						placeholder="Location"
						on:change={() => updateLiturgyData(displayLiturgy)}
					/>
				</p>
			</div>
		{/if}
	</header>

	<main class="space-y-8">
		{#each displayLiturgy.content as section, sectionIndex}
			<section class="bg-white rounded-lg shadow-md px-4 py-6 border border-red-800">
				<div
					class={cn('flex items-center justify-center mb-4', {
						'justify-between': isAdmin && storeState.isAdminView
					})}
				>
					{#if isAdmin}
						<InlineEditable
							id="section-name-{sectionIndex}"
							editable={isAdmin && storeState.isAdminView}
							label={translations.sectionNameLabel}
							bind:value={section.name}
							disabled={isLoading}
							class="text-2xl font-semibold pb-2 block text-gray-800 font-serif"
							placeholder="Section name..."
							on:change={() => updateLiturgyData(displayLiturgy)}
						/>
					{:else}
						<h2 class="text-2xl text-center font-semibold text-gray-800 mb-4 pb-2">
							{section.name}
						</h2>
					{/if}

					{#if isAdmin && storeState.isAdminView && onDeleteSection}
						<button
							on:click={() => onDeleteSection(sectionIndex)}
							disabled={isLoading}
							class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							🗑️ {translations.deleteSection}
						</button>
					{/if}
				</div>

				<div class="space-y-4">
					{#each section.content as paragraph, paragraphIndex}
						{@const speakerInfo = getSpeaker(paragraph.by)}
						<div class={cn('bg-gray-50 rounded-lg p-4')}>
							<div class="[&>*]:inline-block items-baseline gap-2">
								{#if isAdmin}
									{#if storeState.isAdminView}
										<label for="paragraph-speaker-{sectionIndex}-{paragraphIndex}" class="sr-only">
											{translations.speakerLabel}
										</label>
										<select
											id="paragraph-speaker-{sectionIndex}-{paragraphIndex}"
											bind:value={paragraph.by}
											disabled={isLoading || !(isAdmin && storeState.isAdminView)}
											on:change={() => updateLiturgyData(displayLiturgy)}
											class={cn(
												'text-sm text-gray-500 cursor-pointer font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1',
												{
													'cursor-default': isLoading || !(isAdmin && storeState.isAdminView)
												}
											)}
										>
											{#each allSpeakers as speaker}
												<option value={speaker}>{speaker}</option>
											{/each}
											<option value="">-- {translations.customSpeaker} --</option>
										</select>
									{:else if paragraph.by !== ''}
										<span class="text-sm text-gray-500 font-medium">
											{paragraph.by}:
										</span>
									{/if}
									{#if paragraph.by === '' && isAdmin && storeState.isAdminView}
										<InlineEditable
											id="paragraph-custom-speaker-{sectionIndex}-{paragraphIndex}"
											editable={isAdmin && storeState.isAdminView}
											label={translations.customSpeakerLabel}
											bind:value={paragraph.by}
											disabled={isLoading}
											class="inline text-sm text-gray-500 font-medium"
											placeholder={translations.enterCustomSpeaker}
											on:change={() => updateLiturgyData(displayLiturgy)}
										/>
									{/if}
								{:else}
									<span class="text-sm text-gray-500 font-medium">
										{paragraph.by}:
									</span>
								{/if}

								{#if paragraph.cross || (isAdmin && storeState.isAdminView)}
									<button
										disabled={!(isAdmin && storeState.isAdminView)}
										class={cn('inline text-red-600 text-lg transition-colors ', {
											'text-red-600': paragraph.cross,
											'text-gray-400': !paragraph.cross
										})}
										title={paragraph.cross ? 'Make the sign of the cross' : 'Read as ususal'}
										on:click={() => {
											paragraph.cross = !paragraph.cross;
											updateLiturgyData(displayLiturgy);
										}}
									>
										☦
									</button>
								{/if}

								<InlineEditable
									id="paragraph-text-{sectionIndex}-{paragraphIndex}"
									editable={isAdmin && storeState.isAdminView}
									label={translations.paragraphTextLabel}
									bind:value={paragraph.text}
									multiline={true}
									disabled={isLoading}
									class={cn('text-gray-800 leading-relaxed', {
										'!inline': !(isAdmin && storeState.isAdminView)
									})}
									placeholder="Enter paragraph text..."
									on:change={() => updateLiturgyData(displayLiturgy)}
								/>
							</div>
							{#if isAdmin && storeState.isAdminView && (speakerInfo?.title || speakerInfo?.organization)}
								<div class="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-gray-200">
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
							{/if}

							{#if isAdmin && storeState.isAdminView}
								<div class="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
									<label class="flex items-center gap-2">
										<input
											type="checkbox"
											id="paragraph-cross-{sectionIndex}-{paragraphIndex}"
											bind:checked={paragraph.cross}
											disabled={isLoading}
											class="rounded disabled:opacity-50 disabled:cursor-not-allowed"
											on:change={() => updateLiturgyData(displayLiturgy)}
										/>
										<span class="text-sm text-gray-700"
											>{translations.hasCross || 'Has cross (✝)'}</span
										>
									</label>
									{#if onDeleteParagraph}
										<button
											on:click={() => onDeleteParagraph(section, paragraphIndex)}
											disabled={isLoading}
											class="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											🗑️ {translations.delete}
										</button>
									{/if}
								</div>
							{/if}
						</div>
					{/each}

					{#if isAdmin && storeState.isAdminView && onAddParagraph}
						<button
							on:click={() => onAddParagraph(section)}
							disabled={isLoading}
							class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							➕ {translations.addParagraph}
						</button>
					{/if}
				</div>
			</section>
		{/each}

		{#if isAdmin && storeState.isAdminView && onAddSection}
			<!-- Add New Section -->
			<button
				on:click={onAddSection}
				disabled={isLoading}
				class="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				➕ {translations.addNewSection}
			</button>
		{/if}
	</main>
{/if}
