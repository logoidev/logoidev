<script lang="ts">
	import Separator from 'src/components/Separator.svelte';

	import { onMount } from 'svelte';
	import BookMeeting from 'src/components/BookMeeting.svelte';
	import EmailButton from 'src/components/EmailButton.svelte';
	import { COMPANY_NAME } from 'src/data/consts';
	import { INTRO_EMAIL } from 'src/data/emails';
	import ReadEstimate from 'src/components/ReadEstimate.svelte';
	import CodeOnGithub from 'src/components/CodeOnGithub.svelte';
	import LinkButton from 'src/components/LinkButton/LinkButton.svelte';
	import BlogMeta from 'src/components/BlogMeta.svelte';
	import { estimateMinutesToRead } from 'src/utils/estimate-time-to-read';
	import type { Post } from '$lib/posts';
	import Socials from 'src/components/Socials/Socials.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import { getIndexUrl } from 'src/shared/routes.js';
	import Copyright from 'src/components/Copyright.svelte';

	import Image from 'src/components/Image.svelte';

	export let data;

	let minutesToRead = 0;
	let rounded = true;

	onMount(() => {
		const articleText = document.querySelector('article')?.textContent || '';
		minutesToRead = estimateMinutesToRead(articleText);
	});
</script>

<BlogMeta title={data.title} type="article" url={`/blog/${data.id}`} previewImageUrl="" />

<div>
	<div class="flex justify-center items-center mb-4">
		<a href="/blog" class="flex flex-col items-center">
			<span class="text-2xl text-center font-serif mt-4">{COMPANY_NAME}</span>
			<Image class="w-44" src="/images/blog.svg" />
		</a>
	</div>

	<div class="flex flex-col justify-center items-center gap-2 mb-4 relative">
		<h2 class="text-3xl font-serif text-center">{data.title}</h2>

		{#if minutesToRead}
			<ReadEstimate estimate={minutesToRead} />
		{/if}
		<Separator />
	</div>

	<div class="sm:w-3/4 sm:mx-auto mx-6">
		{#key data.id}
			<svelte:component this={data.Content} />
		{/key}
		{#if !data.hidden}
			<CodeOnGithub path={`lib/posts/${data.id}.svelte`} />
		{/if}
	</div>

	<div class="flex flex-col justify-center items-center gap-2 mt-4">
		<Separator />
		<time title={`Published at ${new Date(data.published).toLocaleTimeString()}`}>
			{new Date(data.published).toLocaleDateString()}
		</time>
	</div>

	<div class="flex flex-col items-center mt-12 gap-2">
		{#if data.gh_discussion_id}
			<LinkButton
				href={`https://github.com/logoidev/logoidev/discussions/${data.gh_discussion_id}`}
				text="Discuss on GitHub"
				title="Public discussion where all commenters are welcome"
			/>
			<span>or</span>

			<EmailButton
				email={INTRO_EMAIL}
				subject={`Logoi Blog - "${data.title}"`}
				title="Email us with comments privately"
			/>
			<span>or</span>
			<BookMeeting text="👋" size="sm" title="Schedule a call" />
		{/if}
	</div>

	<div class="flex flex-col justify-center items-center font-serif">
		<Socials withToggle />

		<ToggleQr
			animated
			{rounded}
			url={getIndexUrl(data ? `/blog/${data.id}` : '/blog')}
			on:click={() => (rounded = !rounded)}
		/>

		<Copyright />
	</div>
</div>
