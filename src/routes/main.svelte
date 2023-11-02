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

	import Copyright from '../components/Copyright.svelte';
	// import AcademyLink from '../components/AcademyLink.svelte';

	import { getIndexUrl } from '../shared/routes';
	import { SOCIALS } from '../data/socials';
	import { INTRO_EMAIL } from '../data/emails';
	import IconLink from 'src/components/IconLink.svelte';
	import { getRoute, type Route } from 'src/utils/routing';
	import Blog from './blog/blog.svelte';
	import BookMeeting from 'src/components/BookMeeting.svelte';

	let isUnlocked = false;
	let isNewBannerLoading = false;
	let rounded = false;
	let route: Route;

	const updateRoute = () => (route = getRoute({ nested: true })[0]);

	onMount(() => {
		if (window.location.search) {
			window.location.href = window.location.pathname;
		}

		updateRoute();
		window.addEventListener('hashchange', updateRoute);
	});
</script>

{#if route === 'blog'}
	<Blog />
{:else}
	<div class="flex flex-col touch-manipulation scroll-smooth font-serif mt-4">
		<div class="flex flex-col justify-center items-center h-screen">
			<Header noLink greek={isUnlocked} loading={isNewBannerLoading} />

			<p class="text-xl max-w-md text-center px-10 my-4">
				We are a digital design collective trying to infuse liberal arts, philosophy and beauty with
				the most advanced technology
			</p>

			<Services />

			<BookMeeting />
		</div>
		<div class="flex flex-col justify-center items-center">
			<Separator widthPercentage={40} />

			<Team />

			<EmailButton
				class="my-4"
				email={INTRO_EMAIL}
				subject={`Logoi Development - contact request`}
			/>

			<IconLink href="#blog" target="" title="Blog" iconName="blog" scale={1.2} class="mt-0" />

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
{/if}
