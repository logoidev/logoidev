<script lang="ts">
	import { onMount } from 'svelte';

	import Header from '../../components/Header.svelte';
	import EmailButton from '../../components/EmailButton.svelte';
	import Socials from '../../components/Socials/Socials.svelte';
	import ToggleQr from '../../components/ToggleQR.svelte';
	import NameAvatar from '../../components/NameAvatar.svelte';
	import Copyright from '../../components/Copyright.svelte';
	import Spinner from '../../components/Spinner.svelte';
	import MapLink from 'src/components/MapLink.svelte';
	import LinkButton from '../../components/LinkButton/LinkButton.svelte';

	import { USERS } from '../../data/users';
	import { getUserUrl } from '../../shared/routes';
	import type { UserData } from '../../types/user';
	import { PAGE_URLS } from '../config';
	import ResumeLink from 'src/components/ResumeLink.svelte';

	let userData: UserData;

	let qrPngDataUrl: string | null = null;

	onMount(() => {
		const pathUserId = window.location.hash.substring(1);

		const existingUserData = USERS.find(({ id }) => id === pathUserId);
		const isReservedPage = PAGE_URLS.includes(pathUserId);

		if (existingUserData) {
			userData = existingUserData;
		} else if (!isReservedPage) {
			window.location.href = window.location.origin;
		}

		if (window.location.search) {
			window.location.href = window.location.pathname;
		}
	});
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

		<LinkButton href={userData.calendar_link} size="lg" text="Book a meeting" />

		<span class="text-xl my-2">or</span>

		<EmailButton
			size="md"
			email={userData.email}
			subject={`Logoi Development - reaching out to ${userData.first_name}`}
		/>

		<br />
		<Socials socials={userData.socials} />

		{#if userData.has_resume}
			<ResumeLink id={userData.id} />
		{/if}

		<MapLink />

		<ToggleQr
			rounded
			textOffset="1rem"
			shown={!userData.socials.length}
			text={userData.id.toUpperCase()}
			unlockImageSrc={userData.unlockImage}
			onPngDataUrl={(dataUrl) => (qrPngDataUrl = dataUrl)}
			onCenterClick={async () => {
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
