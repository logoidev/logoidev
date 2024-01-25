import { stripe } from './stripe';

// handle POST /create-payment-intent
export const createPaymentIntent = async (amount: number) => {
	// create the payment intent
	const paymentIntent = await stripe.paymentIntents.create({
		amount,
		// note, for some EU-only payment methods it must be EUR
		currency: 'usd',
		// specify what payment methods are allowed
		// can be card, sepa_debit, ideal, etc...
		payment_method_types: ['card'],
		automatic_payment_methods: {
			enabled: true
		}
	});

	const clientSecret = paymentIntent.client_secret;
	return { clientSecret };
};
