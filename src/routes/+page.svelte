<script lang="ts">
	import { onMount } from 'svelte';

	import Header from '../components/Header.svelte';
	import Services from '../components/Services.svelte';
	import EmailButton from '../components/EmailButton.svelte';
	import Separator from '../components/Separator.svelte';
	import Team from '../components/Team.svelte';
	import Socials from '../components/Socials/Socials.svelte';
	import ToggleQr from '../components/ToggleQR.svelte';
	import MapLink from '../components/MapLink.svelte';
	import LinkButton from '../components/LinkButton/LinkButton.svelte';
	import Copyright from '../components/Copyright.svelte';
	import AcademyLink from '../components/AcademyLink.svelte';

	import { CALENDAR_LINK, getIndexUrl } from '../shared/routes';
	import { SOCIALS } from '../data/socials';
	import { INTRO_EMAIL } from '../data/emails';

	let isUnlocked = false;
	let isNewBannerLoading = false;
	let rounded = false;

	onMount(() => {
		if (window.location.search) {
			window.location.href = window.location.pathname;
		}
	});
</script>

<div class="flex flex-col touch-manipulation scroll-smooth font-serif mt-4">
	<div class="flex flex-col justify-center items-center h-screen">
		<Header noLink greek={isUnlocked} loading={isNewBannerLoading} />

		<p class="text-xl max-w-md text-center max-w-sm px-10 my-4">
			We are a digital design agency specialising in web development, user interface design, spatial
			computing and custom R&D.
		</p>

		<div class="w-32">
			<!-- <spline-viewer url="https://prod.spline.design/V3tfz6c0XrYQ3Mwb/scene.splinecode"
			></spline-viewer> -->
		</div>

		{#if window.location.hash === '#react'}
			<div id="react-root"></div>
		{/if}

		<Services />

		<LinkButton class="bg-slate-50 mt-6" href={CALENDAR_LINK} size="lg" text="Book a meeting" />
	</div>
	<div class="flex flex-col justify-center items-center">
		<Separator widthPercentage={40} />

		<Team />

		<EmailButton email={INTRO_EMAIL} subject={`Logoi Development - business enquiry`} />

		<Socials withToggle socials={SOCIALS} />

		<!-- <AcademyLink /> -->

		<MapLink />

		{#if !isUnlocked}
			<ToggleQr
				animated
				{rounded}
				url={getIndexUrl()}
				imageSrc="/images/qr.svg"
				password={[0, 1, 2]}
				onCenterClick={() => (rounded = !rounded)}
				onUnlock={() => (isUnlocked = true)}
			/>
		{/if}

		<Copyright />
	</div>
</div>
