import { stripe } from './stripe';

export const confirmPayment = () => {
	const result = await stripe.confirmPayment({
		elements,
		// specify redirect: 'if_required' or a `return_url`
		redirect: 'if_required'
	});
	console.log('Confirm payment', result);
};
