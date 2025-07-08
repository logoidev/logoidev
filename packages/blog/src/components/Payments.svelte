<script lang="ts">
	import type { UserData } from '../types/user';
	import EmailButton from './EmailButton.svelte';

	import Separator from './Separator.svelte';
	import Socials from './Socials/Socials.svelte';

	export let userData: UserData;

	let isHourlyRateShown = false;
	const onShowHourlyRate = () => (isHourlyRateShown = !isHourlyRateShown);
</script>

{#if userData.hourly_rate_usd !== 0 && userData.payments.length !== 0}
	<Separator top={4} bottom={3} />

	<span class="text-2xl my-2">Book a meeting</span>
	<button
		class="text-xl inline-block my-4 border-2 py-2 px-4 rounded border-black hover:bg-slate-200"
		on:click={onShowHourlyRate}>🪙 See base hourly rate</button
	>

	{#if isHourlyRateShown}
		<div class="text-xl">${userData.hourly_rate_usd}/hour</div>
		<Socials withSeparators={false} socials={userData.payments} />

		<EmailButton
			email="hi@logoi.dev"
			text="Get detailed quote"
			subject={`Get detailed quote for ${userData.first_name}'s services`}
		/>
	{/if}
{/if}
