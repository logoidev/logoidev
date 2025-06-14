<script lang="ts">
	import { page } from '$app/stores';
	import Socials from 'src/components/Socials/Socials.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import { getIndexUrl } from 'src/shared/routes';

	let rounded = true;
	export let metadata;
</script>

<div class="flex flex-col justify-between min-h-[100svh]">
	<div class="flex justify-center items-center">
		<a href="/resolutions" class="flex flex-col items-center">
			<span class="text-2xl text-center font-serif mt-4">Board Resolution</span>
		</a>
	</div>

	<div class="p-8 max-w-4xl mx-auto">
		<article class="dark:prose-invert mx-auto">
			<header class="mb-8">
				<h1 class="text-3xl font-serif mb-4">{metadata?.title || 'Untitled Resolution'}</h1>
				<div class="text-sm opacity-50 space-y-1">
					<p>Resolution ID: {metadata?.resolutionId || 'N/A'}</p>
					<p>Date: {metadata?.date ? new Date(metadata.date).toLocaleDateString() : 'N/A'}</p>
					<p>Location: {metadata?.location || 'N/A'}</p>
				</div>
				<div class="border-t border-gray-200 dark:border-gray-800 my-6"></div>
			</header>
			<slot />
		</article>
	</div>

	<div class="flex flex-col justify-center items-center font-serif">
		<Socials withToggle />

		<ToggleQr
			animated
			{rounded}
			url={getIndexUrl($page.url.pathname)}
			qrGraphicSrc="/images/qr.svg"
			on:click={() => (rounded = !rounded)}
		/>

		<Copyright />
	</div>
</div>

<style>
	:global(.prose) {
		max-width: 65ch;
	}
	:global(.prose h1) {
		font-family: var(--font-serif);
		font-size: 2.5em;
		margin-top: 0;
	}
	:global(.prose h2) {
		font-family: var(--font-serif);
		font-size: 1.8em;
		margin-top: 2em;
	}
	:global(.prose h3) {
		font-family: var(--font-serif);
		font-size: 1.4em;
	}
	:global(.prose p) {
		margin-top: 1.25em;
		margin-bottom: 1.25em;
	}
	:global(.prose ul) {
		margin-top: 1.25em;
		margin-bottom: 1.25em;
	}
	:global(.prose li) {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
	}
</style>
