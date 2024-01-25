import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';

const stripe = new Stripe(SECRET_STRIPE_KEY);

// TODO: Does this affect performance?
export const prerender = false;

const DOLLAR = 100;

type PostBody = {
	amount: number;
};

export const POST = async (event) => {
	const { amount }: PostBody = await event.request.json();

	const paymentIntent = await stripe.paymentIntents.create({
		amount: amount * DOLLAR,
		currency: 'usd',
		automatic_payment_methods: {
			enabled: true
		}
	});

	return json({
		clientSecret: paymentIntent.client_secret
	});
};
