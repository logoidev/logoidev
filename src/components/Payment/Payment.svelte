<script lang="ts">
	import { Elements, PaymentElement } from 'svelte-stripe';
	import { onMount } from 'svelte';
	import EmailButton from '../EmailButton.svelte';
	import { createPaymentIntent, updatePaymentIntent } from './utils/intents.client';
	import { getErrorMessage } from 'src/utils/get-error-messge';
	import type { PaymentDestination } from 'src/routes/payment/types';
	import { getStripe } from './utils/stripe';
	import type Stripe from 'stripe';
	import Spinner from '../Spinner.svelte';

	export let destination: PaymentDestination = 'main';
	export let to = 'Logoi';
	export let give = false;
	const reward = $$props.$$slots.reward;

	type StripeElements = unknown;

	let stripe: Stripe | undefined;
	let paymentIntentId: string | null;
	let error: string | undefined;
	let success: boolean = false;
	let elements: StripeElements | undefined;
	let processing = false;
	let isCustomAmountShown = false;
	let amount = 1;
	let donatedAmount = 0;
	let thankYouShown = false;

	$: {
		console.log('Payment id changed', paymentIntentId);
	}

	const initilizeStripe = async () => {
		try {
			const stripeInstance = await getStripe();

			if (stripeInstance) {
				// TODO: Fix stipe TS issue
				stripe = stripeInstance;

				// TODO: Apple Pay
				// const cardElement = elements.getElement(CardElement);

				// const paymentMethod = await stripe.createPaymentMethod({
				// 	type: 'card',
				// 	card: cardElement
				// });
				// console.log('Payment Method:', paymentMethod);

				paymentIntentId = await createPaymentIntent({ amount, destination });
			}
		} catch (e) {
			console.error(e);
			error = getErrorMessage(error);
		}
	};

	onMount(initilizeStripe);

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
		// TODO: Fix stripe typing
		const result = await stripe.confirmPayment({
			elements,
			redirect: 'if_required'
		});

		if (result.error) {
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

		console.log('Recreating payment intent for $', amount);

		if (paymentIntentId) {
			// await cancelPaymentIntent(paymentIntentId);
		} else {
			error = 'No payment intent to update';
			return;
		}
		console.log('Updating intent', newAmount);
		await updatePaymentIntent({ paymentIntentId, amount: newAmount });

		isCustomAmountShown = false;

		if (newAmount > 1) {
			thankYouShown = true;
		}
	};
</script>

<div class="flex justify-center font-sans">
	<form on:submit|preventDefault={submit} class="flex flex-col gap-4 text-center">
		<p class="flex justify-center mt-4 text-lg">Give to {to}</p>
		{#if !stripe}
			<div>Stipe not initialised</div>
		{:else if !paymentIntentId}
			<Spinner />
		{:else if success}
			<div>
				<div class="text-green-700">Thank you! ❤️</div>
				<div class="text-gray-500 mt-2">${donatedAmount} received</div>

				{#if reward}
					<slot name="reward" />
				{/if}
			</div>
		{:else if thankYouShown}
			<div class="flex flex-col gap-2">
				<div class="text-xl">Thank you for trying to give more!</div>
				<div>We appreciate your generousity.</div>
				<div>Unfortunately we can't accept custom amounts yet.</div>
				<div>Please email us though! We have a gift for you.</div>

				<div class="mt-2">
					<EmailButton email="vlad@logoi.dev" subject={`Want to give more to ${to}`} />
				</div>
			</div>
		{:else}
			{#key paymentIntentId}
				<Elements
					{stripe}
					clientSecret={paymentIntentId}
					theme="flat"
					labels="floating"
					variables={{ colorPrimary: '#000' }}
					rules={{ '.Input': { border: 'solid 1px #0002' } }}
					bind:elements
				>
					<PaymentElement />
				</Elements>
			{/key}
		{/if}

		{#if error}
			<div class="text-red-700">Error: {error}</div>
		{/if}

		{#if !success && !thankYouShown}
			<button disabled={processing} class="border rounded px-4 py-2 disabled:text-gray-700"
				>{processing ? '...' : `${give ? 'Give' : 'Pay'} $${amount}`}</button
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
