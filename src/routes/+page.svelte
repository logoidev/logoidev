<script lang="ts">
	import Header from '../components/Header.svelte';
	import Services from '../components/Services.svelte';
	import EmailButton from '../components/EmailButton.svelte';
	import Separator from '../components/Separator.svelte';
	import Team from '../components/Team.svelte';
	import Socials from '../components/Socials/Socials.svelte';
	import ToggleQr from '../components/ToggleQR.svelte';
	import MapLink from '../components/MapLink.svelte';
	import Copyright from '../components/Copyright.svelte';

	import { getIndexUrl } from '../shared/routes';
	import { SOCIALS } from '../data/socials';
	import { INTRO_EMAIL } from '../data/emails';
	import IconLink from 'src/components/IconLink.svelte';

	import BookMeeting from 'src/components/BookMeeting.svelte';

	import Payment from 'src/components/Payment/Payment.svelte';

	let isUnlocked = false;
	let isNewBannerLoading = false;
	let rounded = false;
</script>

<div class="flex flex-col touch-manipulation scroll-smooth font-serif mt-4">
	<div class="flex flex-col justify-center items-center h-screen">
		<Header noLink greek={isUnlocked} loading={isNewBannerLoading} />

		<p class="text-xl max-w-md text-center px-10 my-4">
			We are a digital design collective<br />working on joining liberal arts with <br /> the most advanced
			technology
		</p>

		<Services />

		<BookMeeting text="Claim your coin 🪙" href="/c" target={undefined} />
	</div>
	<div class="flex flex-col justify-center items-center">
		<Separator widthPercentage={40} />

		<Team />

		<EmailButton class="my-4" email={INTRO_EMAIL} subject={`Logoi Development - contact request`} />

		<IconLink href="blog" target="" title="Blog" iconName="blog" scale={1.2} class="mt-0" />

		<Socials withToggle />

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
		{:else}
			<Payment />
		{/if}

		<Copyright />
	</div>
</div>
