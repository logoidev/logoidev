import type { StripeElements } from '@stripe/stripe-js';
import { getStripe } from 'src/components/Payment/utils/stripe';

export const confirmPayment = async (elements: StripeElements) => {
	const stripe = await getStripe();
	if (!stripe) {
		console.error('Stripe not imported...');
		return;
	}
	const result = await stripe.confirmPayment({
		elements,
		redirect: 'if_required' // always for Apple Pay
		// confirm: true
	});
	console.log('Confirm payment', result);
};
