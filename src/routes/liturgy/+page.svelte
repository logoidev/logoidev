<script lang="ts">
	export let data;

	$: ({ liturgy, locale } = data);

	$: console.log(liturgy, locale);
</script>

<svelte:head>
	<title>Liturgy - {liturgy?.title || 'Loading...'}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	{#if liturgy}
		<header class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">{liturgy.title}</h1>
			<div class="text-gray-600 space-y-1">
				<p><strong>Language:</strong> {liturgy.language}</p>
				<p><strong>Author:</strong> {liturgy.author.name} ({liturgy.author.by})</p>
				<p><strong>Date:</strong> {liturgy.date}</p>
				<p><strong>Location:</strong> {liturgy.location}</p>
			</div>
		</header>

		<main class="space-y-8">
			{#each liturgy.content as section}
				<section class="bg-white rounded-lg shadow-md p-6">
					<h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
						{section.name}
					</h2>

					<div class="space-y-4">
						{#each section.content as paragraph}
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
										<p class="text-sm text-gray-500 mb-2 font-medium">
											{paragraph.by}
										</p>
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

		<!-- Raw JSON Display -->
		<details class="mt-12">
			<summary class="cursor-pointer text-lg font-semibold text-gray-700 hover:text-gray-900 mb-4">
				📄 View Raw JSON Data
			</summary>
			<pre
				class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">{JSON.stringify(
					liturgy,
					null,
					2
				)}</pre>
		</details>
	{:else}
		<div class="text-center py-12">
			<div class="text-gray-500 text-lg">Loading liturgy data...</div>
		</div>
	{/if}
</div>

<style>
	pre {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		line-height: 1.5;
	}
</style>
