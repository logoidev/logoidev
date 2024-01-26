<script lang="ts">
	import { USERS } from '../data/users';
	import NameAvatar from './NameAvatar.svelte';
</script>

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
