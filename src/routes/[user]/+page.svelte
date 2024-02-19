<script lang="ts">
	import Header from '../../components/Header.svelte';
	import EmailButton from '../../components/EmailButton.svelte';
	import Socials from '../../components/Socials/Socials.svelte';
	import ToggleQr from '../../components/ToggleQR.svelte';
	import NameAvatar from '../../components/NameAvatar.svelte';
	import Copyright from '../../components/Copyright.svelte';
	import Spinner from '../../components/Spinner.svelte';
	import MapLink from 'src/components/MapLink.svelte';
	import LinkButton from '../../components/LinkButton/LinkButton.svelte';

	import { getUserUrl } from '../../shared/routes';
	import type { UserData } from 'src/types/user';

	import ResumeLink from 'src/components/ResumeLink.svelte';

	export let data;
	const userData: UserData = data;
	let qrPngDataUrl: string | null = null;
	let rounded = true;
</script>

<div class="flex flex-col touch-manipulation items-center min-w-fit font-serif h-screen mt-12">
	<Header />
	{#if !userData}
		<Spinner />
	{:else}
		<NameAvatar {userData} clickableLink={false} />

		<ul class="mb-6">
			{#each userData.titles as title}
				<li class="text-xl">{title}</li>
			{/each}
		</ul>

		<EmailButton
			size="md"
			email={userData.email}
			subject={`Logoi Development - reaching out to ${userData.first_name}`}
		/>

		{#if userData.calendar_link}
			<span class="text-xl my-2">or</span>
			<LinkButton href={userData.calendar_link} size="lg" text="👋" />
		{/if}

		<br />
		<Socials socials={userData.socials} />

		{#if userData.has_resume}
			<ResumeLink id={userData.id} />
		{/if}

		<MapLink />

		<ToggleQr
			{rounded}
			textOffset="1rem"
			shown={!userData.socials.length}
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
			url={getUserUrl(userData)}
		/>

		<Copyright />
	{/if}
</div>
