<script lang="ts">
	import Header from 'src/components/Header.svelte';
	import EmailButton from 'src/components/EmailButton.svelte';
	import Separator from 'src/components/Separator.svelte';
	import Socials from 'src/components/Socials/Socials.svelte';
	import ToggleQr from 'src/components/ToggleQR.svelte';
	import MapLink from 'src/components/MapLink.svelte';
	import Copyright from 'src/components/Copyright.svelte';

	import { getIndexUrl } from 'src/shared/routes';
	import { INTRO_EMAIL } from 'src/data/emails';
	import IconLink from 'src/components/IconLink.svelte';

	import Payment from 'src/components/Payment/Payment.svelte';

	const referrer = 'logoi';
	const SRC_EXTERNAL = `?src_external=${referrer}`;

	const UN_DONATION_LINK = 'https://crisisrelief.un.org/t/ukraine' + SRC_EXTERNAL;
	const U24_DONATION_LINK = 'https://u24.gov.ua/donate' + SRC_EXTERNAL;

	const warStarted = new Date('02-24-2022').getTime();
	const now = new Date().getTime();

	let isDirectDonation = false;

	const warDurationMs = now - warStarted;
	let elapsedSeconds = 0;

	setInterval(() => elapsedSeconds++, 1000);

	const timeToHumanReadable = (ms: number) => {
		let x = ms / 1000;
		const seconds = Math.floor(x % 60);
		x /= 60;
		const minutes = Math.floor(x % 60);
		x /= 60;
		const hours = Math.floor(x % 24);
		x /= 24;
		const days = Math.floor(x % 365);
		x /= 365;
		const years = Math.floor(x);
		return {
			years,
			days,
			hours,
			minutes,
			seconds
		};
	};

	const warTime = timeToHumanReadable(warDurationMs);
	$: warDuration = `${warTime.years}y ${warTime.days}d ${warTime.hours}h ${warTime.minutes}m ${warTime.seconds + elapsedSeconds}s`;

	let isUnlocked = false;
	let isNewBannerLoading = false;
	let rounded = false;
</script>

<div class="flex flex-col touch-manipulation scroll-smooth font-serif mt-4">
	<div class="flex flex-col justify-center items-center">
		<Header scale={0.75} greek={isUnlocked} loading={isNewBannerLoading} />

		<p class="text-xl max-w-md text-center px-10 my-4">
			We appreciate you taking a step to learn more and possibly help Ukraine.
		</p>

		<a target="_blank" href="https://en.wikipedia.org/wiki/Coat_of_arms_of_Ukraine">
			<img class="h-36" alt="Ukraine Coat of Arms" src="/images/external-logos/ua-coa.svg" />
		</a>

		<p class="text-lg max-w-md text-center mt-4 px-10 my-4">
			Our nation is yet again in trouble and I want to convey deep gratitude for all of the support,
			donations and help across the world.
		</p>

		<div class="flex flex-col gap-2 max-w-md text-lg text-center">
			<p>We have been fighting to keep our liberty,<br /> our families, and culture alive for:</p>
			<p class="text-xl">{warDuration}</p>
			<p>
				Our dream is for that counter to stop ticking.<br />
				Every donation helps to bring that day closer.
			</p>
		</div>

		<div class="flex flex-col text-xl gap-4 mt-8 items-center">
			<a class="flex items-center gap-2" target="_blank" href={UN_DONATION_LINK}>
				<img class="w-8" alt="UN Logo" src="/images/external-logos/un.svg" />
				<span>UN Ukraine Humanitarian Fund</span>
			</a>
			<a class="flex items-center gap-2" target="_blank" href={U24_DONATION_LINK}>
				<img class="w-8 rounded" alt="UN Logo" src="/images/external-logos/u24.jpg" />
				<span>United24 donation platform</span>
			</a>
			<button class="flex items-center gap-2" on:click={() => (isDirectDonation = true)}>
				<img class="w-8" alt="UN Logo" src="/images/logoi.svg" />
				<span>Donate $1 directly with Logoi <span title="And get a gift">🌟</span></span>
			</button>

			{#if isDirectDonation}
				<Payment destination="ukraine" give to="Ukraine">
					<div class="flex flex-col gap-1 my-2" slot="reward">
						<div>This is our sincere gift to you! 🌟</div>
						<div>
							It is <a class="underline" href="https://en.wikipedia.org/wiki/Carol_of_the_Bells"
								>Carol of The Bells</a
							>
							- a prominent Ukrainian folk song
							<a href="https://en.wikipedia.org/wiki/Shchedryk_(song)">(Щедрик)</a>.<br />
							Music is composed by
							<a class="underline" href="https://en.wikipedia.org/wiki/Mykola_Leontovych"
								>Mykola Leontovych.</a
							><br />
							Performed and translated by
							<a class="underline" href="https://www.youtube.com/channel/UCmIfqG3ZWcHuwMQ51bCb58g">
								Eileen.
							</a><br />
							It is associated with the spirit of Christmas and Charity worldwide!
						</div>

						<div
							class="w-full aspect-video rounded mt-4"
							title="Carol of the Bells"
							style="position:relative; width:100%; height:0px; padding-bottom:56.250%"
						>
							<iframe
								class="rounded"
								title="Carol of the Bells"
								allow="fullscreen"
								allowfullscreen
								height="100%"
								src="https://streamable.com/ne/peq1ve?loop=0&src_external=logoi"
								width="100%"
								style="border:none; width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden;"
							></iframe>
						</div>
					</div>
				</Payment>
			{/if}
		</div>
	</div>
	<div class="flex flex-col justify-center items-center">
		<Separator top={8} bottom={8} />
		<p class="text-lg w-6/12 text-center">
			If you have a question about Ukraine<br />we will do our best to respond
		</p>
		<EmailButton class="my-4" email={INTRO_EMAIL} subject={`Logoi Development - Ukraine`} />

		<IconLink href="blog" target="" title="Blog" iconName="blog" scale={1.2} class="mt-0" />

		<Socials withToggle />

		<MapLink />

		{#if !isUnlocked}
			<ToggleQr
				animated
				{rounded}
				url={getIndexUrl('ukraine')}
				imageSrc="/images/qr.svg"
				password={[0, 1, 2]}
				onCenterClick={() => (rounded = !rounded)}
				onUnlock={() => (isUnlocked = true)}
			/>
		{/if}

		<Copyright />
	</div>
</div>
