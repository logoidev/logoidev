<script lang="ts">
	import Header from 'src/components/Header.svelte';
	import Services from 'src/components/Services.svelte';
	import Separator from 'src/components/Separator.svelte';
	import Team from 'src/components/Team.svelte';
	import Socials from 'src/components/Socials/Socials.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import MapLink from 'src/components/MapLink.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import Foundation from './foundation/+page.svelte';

	import { getIndexUrl } from '../shared/routes';
	import IconLink from 'src/components/IconLink.svelte';

	import Payment from 'src/components/Payment/Payment.svelte';
	import { ORIGIN_FOUNDATION } from 'src/shared/constants';
	import Projects from 'src/components/Projects.svelte';

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
		<div class="flex flex-col justify-center items-center min-h-[100svh]">
			<Header noLink greek={isUnlocked} loading={isNewBannerLoading} />

			<p role="heading" aria-level="2" class="text-xl max-w-md text-center px-10 my-4">
				We bring innovation, advanced technology and solid design to serve the Church, empower her
				people and glorify God.
			</p>

			<Services />
		</div>
		<div class="flex flex-col justify-center items-center">
			<Separator widthPercentage={40} />

			<Team />

			<Projects />

			<Socials withToggle withTitle />

			<IconLink
				href="blog"
				text="Blog"
				target="_blank"
				title="Go to Blog"
				iconName="blog"
				scale={1.2}
				class="mt-0"
			/>

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
					qrGraphicSrc="/images/qr.svg"
					password={[0, 1, 2]}
					on:click={() => (rounded = !rounded)}
					on:unlock={() => (isUnlocked = true)}
				/>
			{:else}
				<Payment />
			{/if}

			<Copyright />
		</div>
	</div>
{/if}
