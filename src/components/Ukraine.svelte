<script lang="ts">
	import { onMount } from 'svelte';
	import { Storage } from '../utils/storage';

	const DONATION_LINK = 'https://crisisrelief.un.org/t/ukraine';

	let storage: Storage<boolean>;
	let isShown = false;

	onMount(() => {
		storage = new Storage<boolean>('ukraine_banner_shown');
		isShown = storage.value === null ? true : storage.value;
		storage.value = isShown;
	});
</script>

{#if isShown}
	<a
		title="Support Ukraine"
		href={DONATION_LINK}
		target="_blank"
		rel="noreferrer"
		on:click={() => {
			isShown = false;
			storage.value = isShown;
		}}
	>
		<div />
	</a>
{/if}

<style>
	a {
		position: fixed;
		bottom: 0;
		left: 0;
		transform: rotate(45deg) translate(-3rem, 3rem);
	}
	div {
		width: 12rem;
		height: 3rem;
		background: linear-gradient(180deg, #015bbb 0%, #015bbb 50%, #ffd502 50%, #ffd502 100%);
	}
</style>
