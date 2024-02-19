<script lang="ts">
	import EmailButton from 'src/components/EmailButton.svelte';

	import ToggleQr from 'src/components/ToggleQR.svelte';
	import Copyright from 'src/components/Copyright.svelte';

	import { getIndexUrl } from 'src/shared/routes';
	import { INTRO_EMAIL } from 'src/data/emails';

	import { getRandomIntInRange } from 'src/utils/math';
	import { trackAnalyticsEvent } from 'src/components/AnalyticsScripts.svelte';
	import { ORIGIN, ORIGIN_FOUNDATION } from 'src/shared/constants';

	let isUnlocked = false;
	let rounded = Boolean(getRandomIntInRange(0, 1));
	let emojiIndex = 0;

	const EMOJIS = [
		'♥️',
		'⚔️',
		'🗡',
		'🎓',
		'🧠',
		'👍',
		'✌️',
		'🫰',
		'👁',
		'👀',
		'🤲',
		'🙏',
		'🎓',
		'🍀',
		'🌻',
		'⭐️',
		'🌟',
		'☀️',
		'🔥',
		'🍎',
		'🥇',
		'🎼',
		'💻',
		'📱',
		'💵',
		'💰',
		'🪙',
		'🪄',
		'🎉',
		'❤️',
		'💙',
		'💛',
		'☦️',
		'🇬🇪',
		'🇺🇦',
		'🇺🇸',
		'🇨🇦'
	];
	$: emoji = EMOJIS[emojiIndex];

	const updateEmoji = () => {
		emojiIndex = getRandomIntInRange(0, EMOJIS.length - 1);
	};

	updateEmoji();
</script>

<svelte:head>
	<title>Logoi Foundation</title>
	<meta
		name="description"
		content="We are a non-profit organisation dedicated to helping people get better access to digital
		technology and information"
	/>
	<meta property="og:title" content="Logoi Foundation" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={ORIGIN_FOUNDATION} />
	<meta property="og:image" content="/images/logoi-foundation.svg" />
</svelte:head>

<div class="flex flex-col touch-manipulation scroll-smooth font-serif mt-8">
	<div class="flex flex-col justify-center items-center min-h-screen">
		{#if isUnlocked}
			<EmailButton
				class="my-1 h-4 w-4 !p-0 rounded-full text-transparent bg-[#FFD700] hover:bg-blue-500"
				text="."
				email={INTRO_EMAIL}
				subject={`Logoi Foundation - Found gold 🌟`}
				on:click={() => {
					console.log('Found gold');
					trackAnalyticsEvent('found_gold');
				}}
			/>
		{/if}
		<img class="h-48" alt="Logoi Foundation Logo" src="/images/logoi-foundation.svg" />

		<span class={`text-3xl text-center mt-4 font-trajan`}>Logoi Foundation</span>

		<p class="text-xl max-w-md text-center px-10 my-4">
			We are a non-profit organisation dedicated to helping people get better access to digital
			technology and information
		</p>

		<EmailButton
			class="my-4 -ml-1.5"
			text="Email 👋"
			email={INTRO_EMAIL}
			subject={`Logoi Foundation - Saying hi 👋`}
		/>

		{#if !isUnlocked}
			<ToggleQr
				animated
				{rounded}
				url={getIndexUrl('foundation')}
				imageSrc="/images/qr.svg"
				password={[0, 1, 2]}
				on:click={() => (rounded = !rounded)}
				bind:isUnlocked
			/>
		{/if}
		<Copyright startYear={2024} companyName="Logoi Foundation" />

		<div class="fixed left-3 bottom-1.5 bg-white py-1 px-2 rounded bg-opacity-75">
			<span class="cursor-pointer" role="presentation" on:click={updateEmoji}>
				<span class="bg-[#eff1f2] font-mono black rounded px-1.5 py-0.5">{'<made />'}</span
				>{` with ${emoji} by `}
			</span>
			<a class="underline" href={`${ORIGIN}?src_external=foundation`}>Logoi Development</a>
		</div>
	</div>
</div>
