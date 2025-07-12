<script lang="ts">
	import Image from 'src/components/Image.svelte';
	import Socials from 'src/components/Socials/Socials.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import Header from 'src/components/Header.svelte';
	import { getIndexUrl } from 'src/shared/routes';
	import { resolutions } from '$lib/resolutions';
	import { trackEvent } from 'src/lib/analytics/posthog';

	let rounded = true;

	export let data;

	$: console.log('Data', data);
</script>

<div class="flex flex-col justify-between min-h-[100svh]">
	<div class="flex justify-center items-center">
		<Header title="Board Resolutions" />
	</div>

	<div class="p-8 max-w-4xl mx-auto">
		<ul class="flex flex-col gap-4">
			{#each resolutions as { id, metadata }, idx}
				<li class="group">
					<a
						href={`/resolutions/${id}`}
						class="block p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
						on:click={() => trackEvent('resolution_clicked', { resolution_id: id })}
					>
						<div class="flex items-start justify-between">
							<div>
								<h2 class="text-2xl font-serif mb-2">{metadata.title}</h2>
								<div class="text-sm opacity-50 space-y-1">
									<p>Resolution ID: {id}</p>
									<p>Date: {new Date(metadata.date).toLocaleDateString()}</p>
									<p>Location: {metadata.location}</p>
								</div>
							</div>
							<span
								class="text-base ml-2 opacity-50 group-hover:opacity-95"
								title={`Dated ${new Date(metadata.date).toLocaleDateString()}`}
							>
								#{idx + 1}
							</span>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="flex flex-col justify-center items-center font-serif">
		<Socials withToggle />

		<ToggleQr
			animated
			{rounded}
			url={getIndexUrl('/resolutions')}
			on:click={() => (rounded = !rounded)}
		/>

		<Copyright />
	</div>
</div>
