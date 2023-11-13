<script lang="ts">
	import { getMemojiAvatarUrl } from 'src/shared/urls';
	import { getRandomIntInRange } from 'src/utils/math';
	import type { UserData } from '../types/user';
	import Image from './Image.svelte';
	import clsx from 'clsx';

	export let userData: UserData;
	export let noLastName = false;
	export let clickableLink = true;

	let currentMemojiIndex = userData.memojiCount && getRandomIntInRange(1, userData.memojiCount);
	let avatarImageUrl = getMemojiAvatarUrl(currentMemojiIndex, userData.id);

	const onAvatarClick = () => {
		if (!userData.memojiCount) {
			return;
		}

		currentMemojiIndex++;
		if (currentMemojiIndex > userData.memojiCount) {
			currentMemojiIndex = 1;
		}

		avatarImageUrl = getMemojiAvatarUrl(currentMemojiIndex, userData.id);
	};
</script>

<div class="text-3xl flex flex-col items-center mb-2 w-32">
	{#if avatarImageUrl}
		<div class="mx-4 my-2 w-32 h-32">
			<Image src={avatarImageUrl} alt="Avatar" onClick={onAvatarClick} />
		</div>
	{/if}

	<a
		href={clickableLink ? `#${userData.id}` : null}
		class={clsx('mb-4 text-center text-lg', {
			'underline decoration-from-font': clickableLink
		})}
		title={userData.first_name}
	>
		<span>{userData.first_name}</span>
		{#if !noLastName}
			<span>{userData.last_name}</span>
		{/if}
	</a>
</div>
