<script lang="ts">
	import Header from 'src/components/Header.svelte';
	import Services from 'src/components/Services.svelte';
	import EmailButton from 'src/components/EmailButton.svelte';
	import Separator from 'src/components/Separator.svelte';
	import Team from 'src/components/Team.svelte';
	import Socials from 'src/components/Socials/Socials.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import MapLink from 'src/components/MapLink.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import Foundation from './foundation/+page.svelte';

	import { getIndexUrl } from '../shared/routes';
	import { INTRO_EMAIL } from '../data/emails';
	import IconLink from 'src/components/IconLink.svelte';

	import BookMeeting from 'src/components/BookMeeting.svelte';

	import Payment from 'src/components/Payment/Payment.svelte';
	import { ORIGIN_FOUNDATION } from 'src/shared/constants';

	export let data = { origin: '' };
	$: IS_FOUNDATION = data.origin === ORIGIN_FOUNDATION;

	let isUnlocked = false;
	let isNewBannerLoading = false;
	let rounded = false;
</script>

{#if IS_FOUNDATION}
	<Foundation />
{:else}
	<div class="flex flex-col touch-manipulation scroll-smooth font-serif mt-4">
		<div class="flex flex-col justify-center items-center h-screen">
			<Header noLink greek={isUnlocked} loading={isNewBannerLoading} />

			<p class="text-xl max-w-md text-center px-10 my-4">
				We are a digital design collective<br /> joining liberal arts and the most<br /> advanced technology
			</p>

			<Services />

			<BookMeeting text="Claim your coin 🪙" href="/c" target={undefined} />
		</div>
		<div class="flex flex-col justify-center items-center">
			<Separator widthPercentage={40} />

			<Team />

			<EmailButton
				class="my-4"
				email={INTRO_EMAIL}
				subject={`Logoi Development - contact request`}
			/>

			<IconLink href="blog" target="" title="Blog" iconName="blog" scale={1.2} class="mt-0" />

			<Socials withToggle />

			<MapLink />

			<a class="flex flex-col" href={`${ORIGIN_FOUNDATION}?src_external=development`}>
				<img class="h-16" alt="Logoi Foundation Logo" src="/images/logoi-foundation.svg" />
				<span class={`text-sm text-center mt-4 font-trajan`}>Foundation</span>
			</a>

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
{/if}
