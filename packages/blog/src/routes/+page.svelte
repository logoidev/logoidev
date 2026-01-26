<script lang="ts">
	import Header from 'src/components/Header.svelte';
	import Separator from 'src/components/Separator.svelte';
	import Socials from 'src/components/Socials/Socials.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import Copyright from 'src/components/Copyright.svelte';
	import Foundation from './foundation/+page.svelte';
	import ContactButton from 'src/components/ContactButton.svelte';
	import ContactForm from 'src/components/ContactForm.svelte';

	import { getIndexUrl } from '../shared/routes';
	import IconLink from 'src/components/IconLink.svelte';

	import Payment from 'src/components/Payment/Payment.svelte';
	import { ORIGIN_FOUNDATION } from 'src/shared/constants';

	export let data = { origin: '' };
	$: IS_FOUNDATION = data.origin === ORIGIN_FOUNDATION;

	let isUnlocked = false;
	let isNewBannerLoading = false;
	let rounded = false;
	let isContactFormExpanded = false;
	let wasExpanded = false;

	// Scroll contact button into view when form collapses
	$: {
		if (wasExpanded && !isContactFormExpanded) {
			// Form just collapsed, scroll button into view
			setTimeout(() => {
				const button = document.getElementById('contact-button');
				if (button) {
					button.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			}, 400);
		}
		wasExpanded = isContactFormExpanded;
	}
</script>

{#if IS_FOUNDATION}
	<Foundation />
{:else}
	<div class="flex flex-col touch-manipulation scroll-smooth font-serif mt-4">
		<div class="flex flex-col justify-center items-center min-h-[100svh]">
			<Header noLink greek={isUnlocked} loading={isNewBannerLoading} />

			<p role="heading" aria-level="2" class="text-xl max-w-md text-center px-10 mb-4 mt-6">
				We bring innovation, advanced technology and solid design to serve the Church, empower her
				people and glorify God.
			</p>

			<ContactButton
				class="mt-4"
				linkClass="border border-slate-300 py-2 px-4 rounded hover:bg-slate-200"
				buttonText="Contact"
				isExpanded={isContactFormExpanded}
				on:click={() => (isContactFormExpanded = true)}
			/>
		</div>
		<div class="flex flex-col justify-center items-center">
			<Separator widthPercentage={40} />

			<ContactForm
				class="mt-4"
				isExpanded={isContactFormExpanded}
				on:collapse={() => (isContactFormExpanded = false)}
			/>

			<IconLink
				href="blog"
				text="Blog"
				target="_blank"
				title="Go to Blog"
				iconName="blog"
				scale={1.2}
				class="mt-2"
			/>

			<Socials withToggle withTitle withLabels={false} />

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
