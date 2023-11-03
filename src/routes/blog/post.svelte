<script lang="ts">
	import Separator from 'src/components/Separator.svelte';
	import { posts } from './posts';
	import { type SvelteComponent, onMount } from 'svelte';
	import BookMeeting from 'src/components/BookMeeting.svelte';
	import EmailButton from 'src/components/EmailButton.svelte';
	import { INTRO_EMAIL } from 'src/data/emails';
	import ReadEstimate from 'src/components/ReadEstimate.svelte';
	export let id: string;
	$: post = posts.find((p) => p.id === id)!;

	let Post: typeof SvelteComponent | null = null;

	onMount(async () => {
		if (post) {
			try {
				Post = (await import(`./content/${post.id}.svelte`)).default;
			} catch (e) {
				console.error(e);
			}
		} else {
			window.location.hash = '#blog';
		}
	});
</script>

{#if post}
	<div>
		<div class="flex flex-col justify-center items-center gap-2 mb-4 relative">
			<h2 class="text-3xl font-serif text-center">{post.title}</h2>

			<ReadEstimate estimate={post.estimate} />
			<Separator />
		</div>

		{#if Post}
			<div class="sm:w-3/4 mx-auto">
				<svelte:component this={Post} />
			</div>
		{:else}
			<div class="text-center">
				Apologies, but this post does not seem to exist, please check if there's a file like <pre>'./content/{post.id}.svelte'</pre>
			</div>
		{/if}

		<div class="flex flex-col justify-center items-center gap-2 mt-4">
			<Separator />
			<time title={`Published at ${new Date(post.published).toLocaleTimeString()}`}>
				{new Date(post.published).toLocaleDateString()}
			</time>
		</div>

		<div class="flex flex-col items-center mt-12 gap-2">
			<EmailButton email={INTRO_EMAIL} subject="Vision - Logoi Development" />
			<span>or</span>
			<BookMeeting text="👋" size="sm" />
		</div>
	</div>
{:else}
	<div class="text-center">Most likely wrong post id specified as a parameter</div>
{/if}
