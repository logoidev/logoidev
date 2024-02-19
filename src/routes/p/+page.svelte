<script lang="ts">
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import { getIndexUrl } from 'src/shared/routes';
	import { page } from '$app/stores';

	let rounded = false;
	let isUnlocked = false;
	$: pageUrl = getIndexUrl();
</script>

<div class="flex flex-col touch-manipulation scroll-smooth font-serif mt-4">
	<div class="flex flex-col justify-center items-center">
		<ToggleQr
			shown
			withToggle={false}
			animated
			{rounded}
			url={pageUrl}
			imageSrc="/images/qr.svg"
			password={[0, 1, 2]}
			on:click={() => (rounded = !rounded)}
			onUnlock={() => (isUnlocked = true)}
		/>

		<a class="mt-4" href={pageUrl}>{pageUrl}</a>
		<Copyright />
	</div>
</div>
