<script lang="ts">
	import { USERS } from '../data/users';
	import NameAvatarTitle from './NameAvatarTitle.svelte';
</script>

<div>
	<p class="text-2xl text-center mt-4">Team</p>
	<ul title="Team" class="text-2xl flex items-stretch max-w-md my-4 justify-between">
		{#each USERS as userData}
			<li class="justify">
				<!-- TODO: Does not work with GitHub pages - hash or move away from GH -->
				<!-- <a href={`/${user.id}`}> -->
				<NameAvatarTitle {userData} noTitle noLastName />
				<!-- </a> -->
			</li>
		{/each}
	</ul>
</div>
