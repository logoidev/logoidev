<script lang="ts">
	import { page } from '$app/stores';
	import Socials from 'src/components/Socials/Socials.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import { getIndexUrl } from 'src/shared/routes';
	import { marked } from 'marked';

	export let data;
	const { resolution, error } = data;

	let rounded = true;

	$: resolutionContent = resolution ? marked(resolution.content) : '';
</script>

<div class="flex flex-col justify-between min-h-[100svh]">
	<div class="flex justify-center items-center">
		<a href="/resolutions" class="flex flex-col items-center">
			<span class="text-2xl text-center font-serif mt-4">Board Resolution</span>
		</a>
	</div>

	<div class="p-8 max-w-4xl mx-auto">
		{#if error}
			<p>Error: {error}</p>
		{:else if resolution}
			<article class="mx-auto">
				<header>
					<h1 class="text-3xl font-serif mb-4">{resolution.metadata.title}</h1>
					<div class="text-sm opacity-50 space-y-1">
						<p>Resolution ID: {resolution.id}</p>
						<p>Date: {new Date(resolution.metadata.date).toLocaleDateString()}</p>
						<p>Location: {resolution.metadata.location}</p>
					</div>
					<div class="border-t border-gray-200 dark:border-gray-800 my-6"></div>
				</header>
				<div class="resolution-content prose prose-lg dark:prose-invert">
					{@html resolutionContent}
				</div>
			</article>
		{:else}
			<p>No resolution found</p>
		{/if}
	</div>

	<div class="flex flex-col justify-center items-center font-serif">
		<Socials withToggle />

		<ToggleQr
			animated
			{rounded}
			url={getIndexUrl($page.url.pathname)}
			on:click={() => (rounded = !rounded)}
		/>

		<Copyright />
	</div>
</div>

<style>
	:global(.resolution-content) {
		@apply max-w-4xl mx-auto px-4;
	}

	:global(.resolution-content h1) {
		@apply text-2xl font-semibold my-4 pb-2 border-b border-gray-200 dark:border-gray-700;
	}

	:global(.resolution-content h2) {
		@apply text-xl font-semibold my-4 pb-2 border-b border-gray-200 dark:border-gray-700;
	}

	:global(.resolution-content h3) {
		@apply text-lg font-semibold mt-6 mb-3;
	}

	:global(.resolution-content p) {
		@apply my-4 leading-7;
	}

	:global(.resolution-content ul) {
		@apply list-disc list-inside my-4 space-y-1;
	}

	:global(.resolution-content ol) {
		@apply list-decimal list-inside my-4 space-y-1;
	}

	:global(.resolution-content li) {
		@apply my-1;
	}

	:global(.resolution-content li > p) {
		@apply my-1;
	}

	:global(.resolution-content a) {
		@apply text-blue-600 dark:text-blue-400 hover:underline;
	}

	:global(.resolution-content blockquote) {
		@apply border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4 text-gray-600 dark:text-gray-400;
	}

	:global(.resolution-content code) {
		@apply bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono;
	}

	:global(.resolution-content pre) {
		@apply bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 overflow-x-auto;
	}

	:global(.resolution-content pre code) {
		@apply bg-transparent p-0 text-sm font-mono;
	}

	:global(.resolution-content img) {
		@apply rounded-lg my-4 max-w-full;
	}

	:global(.resolution-content hr) {
		@apply my-8 border-gray-200 dark:border-gray-700;
	}

	:global(.resolution-content table) {
		@apply w-full my-4 border-collapse;
	}

	:global(.resolution-content th) {
		@apply border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold;
	}

	:global(.resolution-content td) {
		@apply border border-gray-300 dark:border-gray-700 px-4 py-2;
	}

	:global(.resolution-content strong) {
		@apply font-semibold;
	}

	:global(.resolution-content em) {
		@apply italic;
	}

	:global(.resolution-content br) {
		@apply my-1;
	}

	:global(.resolution-content .prose .anchor) {
		@apply float-left -ml-6 pr-1 opacity-0 hover:opacity-100;
	}

	:global(.resolution-content .prose .heading-element) {
		@apply relative;
	}

	:global(.resolution-content.prose .heading-element:hover .anchor) {
		@apply opacity-100;
	}
</style>
