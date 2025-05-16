<script lang="ts">
	import { INTRO_EMAIL } from 'src/data/emails';
	import { USERS } from '../data/users';
	import EmailButton from './EmailButton.svelte';
	import IconLink from './IconLink.svelte';
	import LinkButton from './LinkButton/LinkButton.svelte';
	import NameAvatar from './NameAvatar.svelte';

	let isOpen = false;
</script>

{#if isOpen}
	<div>
		<p class="text-2xl text-center mt-4">Team</p>
		<ul title="Team" class="text-2xl flex items-stretch max-w-md my-4 justify-between">
			{#each USERS as userData}
				<li class="justify">
					<NameAvatar {userData} noLastName />
				</li>
			{/each}
		</ul>
	</div>

	<LinkButton href="/cal" text="💬 Set up a call" />

	<span class="mt-4">or email</span>

	<EmailButton
		class="my-4"
		email={INTRO_EMAIL}
		subject={`Logoi Development - contact request`}
		copyToClipboard
	/>
{:else}
	<IconLink
		type="button"
		text="Team"
		iconName="developer"
		title="View team and contacts"
		scale={1.2}
		onClick={() => (isOpen = !isOpen)}
	/>
{/if}
