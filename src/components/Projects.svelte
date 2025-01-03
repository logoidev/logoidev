<script>
	import BookMeeting from './BookMeeting.svelte';
	import IconLink from './IconLink.svelte';
	import Separator from './Separator.svelte';

	let isOpen = false;
</script>

{#if isOpen}
	<div class="flex flex-col justify-center items-center gap-5 my-8">
		<p class="text-2xl text-center">Projects</p>

		<BookMeeting text="Claim your coin 🪙" href="/c" target={undefined} />

		<a class="underline" href="/blog/logoi" target="_blank">Learn more</a>
	</div>
{:else}
	<IconLink
		type="button"
		text="Projects"
		iconName="eye"
		title="View projects"
		scale={1.2}
		onClick={() => (isOpen = !isOpen)}
	/>
{/if}
