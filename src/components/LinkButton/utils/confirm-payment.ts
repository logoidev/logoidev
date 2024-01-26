import { stripe } from './stripe';

export const confirmPayment = () => {
	const result = await stripe.confirmPayment({
		elements,
		redirect: 'if_required' // always for Apple Pay
		// confirm: true
	});
	console.log('Confirm payment', result);
};
