<script lang="ts">
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import type { UserData } from 'src/types/user.js';
	import { getUserUrl } from 'src/shared/routes.js';

	export let data;
	const userData: UserData = data;
	let qrPngDataUrl: string | null = null;
	let rounded = true;
	$: pageUrl = getUserUrl(userData);
</script>

<div class="flex flex-col touch-manipulation scroll-smooth font-serif mt-4">
	<div class="flex flex-col justify-center items-center">
		<ToggleQr
			shown
			withToggle={false}
			{rounded}
			textOffset="1rem"
			text={userData.id.toUpperCase()}
			unlockImageSrc={userData.unlockImage}
			on:png-data-url={(dataUrl) => (qrPngDataUrl = dataUrl)}
			on:click={async () => {
				rounded = !rounded;
				if (qrPngDataUrl) {
					const blob = await (await fetch(qrPngDataUrl)).blob();
					const fileURL = URL.createObjectURL(blob);
					console.log('SVG to PNG URL:', fileURL);
					// window.open(fileURL);
				}
			}}
			password={userData.unlockImage ? userData.password : []}
			url={pageUrl}
		/>

		<a class="mt-4" href={pageUrl}>{pageUrl}</a>
		<Copyright />
	</div>
</div>
