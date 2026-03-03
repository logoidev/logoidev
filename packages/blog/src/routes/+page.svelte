<script lang="ts">
	import Header from 'src/components/Header.svelte';
	import Separator from 'src/components/Separator.svelte';
	import Socials from 'src/components/Socials/Socials.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import Foundation from './foundation/+page.svelte';
	import ContactButton from 'src/components/ContactButton.svelte';
	import { getIndexUrl } from '../shared/routes';
	import IconLink from 'src/components/IconLink.svelte';
	import Payment from 'src/components/Payment/Payment.svelte';
	import PresenceIndicator from 'src/lib/partykit/PresenceIndicator.svelte';
	import { ORIGIN_FOUNDATION } from 'src/shared/constants';

	export let data = { origin: '' };

	$: IS_FOUNDATION = data.origin === ORIGIN_FOUNDATION;

	let isUnlocked = false;
	let isNewBannerLoading = false;
	let rounded = false;
	let showPresenceIndicator = false;
</script>

{#if IS_FOUNDATION}
	<Foundation />
{:else}
	<div class="flex flex-col touch-manipulation scroll-smooth font-serif mt-4">
		<div class="flex flex-col justify-center items-center min-h-[100svh]">
			<Header
				noLink
				greek={isUnlocked}
				loading={isNewBannerLoading}
				on:title-click={() => (showPresenceIndicator = !showPresenceIndicator)}
			/>

			<a href="/v" title="">
				<div
					class="mt-6 p-4 hover:rotate-180 transition-transform duration-500 text-xl hover:cursor-pointer"
				>
					Λ
				</div>
			</a>

			<h3 class="text-2xl font-serif text-center mt-6">Purpose-Driven Engineering</h3>

			<p role="heading" aria-level="2" class="text-xl max-w-md text-center px-10 mb-4 mt-4">
				Turning complex requirements into scalable, polished web platforms
			</p>

			<ContactButton
				class="mt-4"
				linkClass="border border-slate-300 py-2 px-4 rounded hover:bg-slate-200"
				buttonText="Contact"
			/>
		</div>
		<div class="flex flex-col justify-center items-center">
			<Separator widthPercentage={40} />

			<Socials withToggle withTitle withLabels={false} />

			<IconLink
				href="blog"
				target="_blank"
				title="Go to Blog"
				iconName="blog"
				scale={1.2}
				class="mt-2"
			/>

			<a class="flex flex-col mt-4" href={`${ORIGIN_FOUNDATION}?src_external=development`}>
				<img class="h-16" alt="Logoi Foundation Logo" src="/images/logoi-foundation.svg" />
				<span class={`text-sm text-center mt-4 font-trajan`}>Foundation</span>
			</a>

			{#if !isUnlocked}
				<ToggleQr
					animated
					{rounded}
					url={getIndexUrl()}
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

<PresenceIndicator showCount={showPresenceIndicator} />
