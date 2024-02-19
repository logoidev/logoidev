<script lang="ts">
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import { getIndexUrl } from 'src/shared/routes';

	let rounded = false;

	$: pageUrl = getIndexUrl();
</script>

<div
	class="flex flex-col justify-center items-center touch-manipulation scroll-smooth font-serif mt-4"
>
	<ToggleQr
		shown
		withToggle={false}
		animated
		{rounded}
		url={pageUrl}
		imageSrc="/images/qr.svg"
		password={[0, 1, 2]}
		on:click={() => (rounded = !rounded)}
		on:unlock={() => console.log('Unlocked')}
	/>

	<a class="mt-4" href={pageUrl}>{pageUrl}</a>
	<Copyright />
</div>
