<script lang="ts">
	import { onMount } from 'svelte';
	import { Storage } from '../utils/storage';

	let storage: Storage<boolean>;
	let isShown = false;

	onMount(() => {
		storage = new Storage<boolean>('ukraine_banner_shown');
		isShown = storage.value === null ? true : storage.value;
		storage.value = isShown;
	});
</script>

{#if isShown}
	<div
		id="flag-ribbon"
		class="fixed -left-16 bottom-0 rotate-45 cursor-pointer"
		role="presentation"
		title="Support Ukraine"
		on:click={() => {
			isShown = false;
			storage.value = isShown;

			let handle = window.open('/ukraine');
			if (handle) {
				handle.blur();
				window.focus();
			}
		}}
	>
		<div />
	</div>
{/if}

<style>
	#flag-ribbon {
		width: 12rem;
		height: 3rem;
		background: linear-gradient(180deg, #015bbb 0%, #015bbb 50%, #ffd502 50%, #ffd502 100%);
	}
</style>
