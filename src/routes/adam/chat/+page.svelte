<script lang="ts">
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import { getIndexUrl } from 'src/shared/routes';
	import ChatInterface from 'src/components/ChatInterface.svelte';
	import Header from 'src/components/Header.svelte';

	let rounded = false;
	let isPageInfoVisible = false;
	let chatLimit: number | undefined = undefined;

	$: pageUrl = getIndexUrl();
</script>

<div
	class="flex w-full h-full flex-col justify-center items-center touch-manipulation scroll-smooth font-serif mt-4"
>
	<Header on:title-click={() => (isPageInfoVisible = !isPageInfoVisible)} scale={0.75} />

	<ChatInterface {chatLimit} />

	{#if isPageInfoVisible}
		<div class="mt-8 flex items-center flex-col">
			<ToggleQr
				shown
				withToggle={false}
				animated
				{rounded}
				url={pageUrl}
				imageSrc="/images/qr.svg"
				password={[0, 1, 2]}
				on:click={() => (rounded = !rounded)}
				on:unlock={() => {
					chatLimit = 200;
					isPageInfoVisible = false;
				}}
			/>

			<Copyright />
		</div>
	{/if}
</div>
