<script lang="ts">
	import { loadStripe } from '@stripe/stripe-js';
	import type Stripe from 'stripe';
	import { Elements, PaymentElement } from 'svelte-stripe';
	import { onMount } from 'svelte';
	import { PUBLIC_STRIPE_KEY, PUBLIC_GOOGLE_MEASUREMENT_ID } from '$env/static/public';
	import EmailButton from '../EmailButton.svelte';

	type StripeElements = unknown;

	let stripe: Stripe | undefined;
	let clientSecret: string | undefined;
	let error: string | undefined;
	let success: boolean = false;
	let elements: StripeElements | undefined;
	let processing = false;
	let isCustomAmountShown = false;
	let amount = 1;
	let donatedAmount = 0;
	let thankYouShown = false;

	console.log('Stripe key', PUBLIC_STRIPE_KEY);
	console.log('GA ID', PUBLIC_GOOGLE_MEASUREMENT_ID);

	const getErrorMessage = (error: unknown, fallback = 'Unknown Error') => {
		if (error instanceof Error) {
			return error.message || fallback;
		}

		if (typeof error === 'string') {
			return error || fallback;
		}

		return String(error || '') || fallback;
	};

	const createPaymentIntent = async (amount: number) => {
		const response = await fetch('/payment', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				amount
			})
		});

		const { clientSecret } = await response.json();

		return clientSecret;
	};

	const submit = async () => {
		if (!stripe) {
			console.error("Stripe isn't initialised");
			return;
		}
		// avoid processing duplicates
		if (processing) return;

		processing = true;

		if (!elements) {
			console.error('No elements found', elements);
			return;
		}

		// Confirm payment with stripe
		const result = await stripe.confirmPayment({
			elements,
			redirect: 'if_required'
		});

		// const result = await new Promise<{ error: string }>((resolve) =>
		// 	setTimeout(() => resolve({ error: '' }), 1000)
		// );

		if (result.error) {
			error = result.error;
			console.error(error);
		} else {
			success = true;
			console.log('Success', { result });

			donatedAmount = result.paymentIntent.amount / 100;
		}
		processing = false;
	};

	const onCustomAmountConfirm = async () => {
		const input = document.getElementById('amount') as HTMLInputElement;
		const newAmount = input?.valueAsNumber ?? 1;

		if (newAmount > 1) {
			thankYouShown = true;
		}

		// console.log('Recreating payment intent for $', amount);
		// clientSecret = await createPaymentIntent(amount);

		isCustomAmountShown = false;
	};

	onMount(async () => {
		try {
			const stripeInstance = await loadStripe(PUBLIC_STRIPE_KEY);
			if (stripeInstance) {
				stripe = stripeInstance;
				clientSecret = await createPaymentIntent(amount);
			}
		} catch (e) {
			console.error(e);
			error = getErrorMessage(error);
		}
	});

	$: console.log(elements);
</script>

<div class="flex justify-center font-sans">
	<form on:submit|preventDefault={submit} class="flex flex-col gap-4 text-center">
		<p class="flex justify-center mt-4 text-lg">Give to Logoi</p>
		{#if !stripe}
			<div>Stipe not initialised</div>
		{:else if !clientSecret}
			<div>No client secret was generated</div>
		{:else if error}
			<div class="text-red-700">Error: {error}</div>
		{:else if success}
			<div>
				<div class="text-green-700">Thank you! ❤️</div>
				<div class="text-gray-500 mt-2">${donatedAmount} received</div>
			</div>
		{:else if thankYouShown}
			<div class="flex flex-col gap-2">
				<div class="text-xl">Thank you for trying to give more!</div>
				<div>We appreciate your generousity.</div>
				<div>Unfortunately we can't accept custom amounts yet.</div>
				<div>Please email us though! We have a gift for you.</div>
				<div class="mt-2">
					<EmailButton
						email="support@logoi.dev"
						subject="Wanted to give more to Logoi! Now what about that gift?)"
					></EmailButton>
				</div>
			</div>
		{:else}
			<Elements
				{stripe}
				{clientSecret}
				theme="flat"
				labels="floating"
				variables={{ colorPrimary: '#7c4dff' }}
				rules={{ '.Input': { border: 'solid 1px #0002' } }}
				bind:elements
			>
				<PaymentElement />
			</Elements>
		{/if}

		{#if !success}
			<button disabled={processing} class="border rounded px-4 py-2 disabled:text-gray-700"
				>{processing ? '...' : `Pay $${amount}`}</button
			>

			{#if isCustomAmountShown}
				<div>
					<input
						class="p-2 border rounded"
						id="amount"
						type="number"
						value={amount}
						placeholder="$1"
						min="1"
					/>
					<button
						type="button"
						class="padding bg-green-100 px-3 py-2 rounded border"
						on:click={onCustomAmountConfirm}>Confirm</button
					>
				</div>
			{:else}
				<button
					type="button"
					class="text-gray-500"
					on:click={() => {
						isCustomAmountShown = true;
						const amountInput = document.getElementById('amount');
						amountInput?.focus();
					}}
				>
					Custom amount
				</button>
			{/if}
		{/if}
	</form>
</div>
