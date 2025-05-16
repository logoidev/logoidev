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
	import BlogImage from 'src/components/BlogImage.svelte';
	import { trackEvent } from 'src/lib/analytics/posthog';

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

		<div class="flex flex-col gap-2 items-center justify-center">
			{#if userData.chat}
				<a
					class="flex gap-2 items-center justify-center border py-3 px-4 rounded border-black"
					target="_blank"
					href={userData.chat.link}
					on:click={() => trackEvent('adam_link_visited')}
				>
					{#if userData.chat.image_url}
						<div class="w-8 h-8">
							<BlogImage src={userData.chat.image_url} class="mt-0" />
						</div>
					{/if}

					<div>Chat with {userData.first_name}</div>
				</a>

				<span>or</span>
			{/if}

			<EmailButton
				copyToClipboard
				class="border-gray-300 border"
				size="sm"
				email={userData.email}
			/>
		</div>

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
