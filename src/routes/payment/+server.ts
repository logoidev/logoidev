import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';

// TODO: Setup Apple Pay after getting Canadian Driver's License
// import { dev } from '$app/environment';

import type {
	CreatePaymentIntentBody,
	UpdatePaymentIntentBody,
	CreatePaymentIntentResponse
} from './types';

const stripe = new Stripe(SECRET_STRIPE_KEY);

// const HOST_URL = dev ? 'http://localhost:5173' : 'https://logoi.dev';
// const STRIPE_REDIRECT_URL = `${HOST_URL}/payment/redirect`;

// TODO: Does this affect performance?
export const prerender = false;

const DOLLAR = 100;

export const POST = async (event) => {
	const {
		amount,
		destination,
		coinId = null
	}: CreatePaymentIntentBody = await event.request.json();

	const paymentIntent = await stripe.paymentIntents.create({
		amount: amount * DOLLAR,
		currency: 'usd',
		automatic_payment_methods: {
			enabled: true
		},
		// return_url: STRIPE_REDIRECT_URL,
		// confirm: true,
		// payment_method_types: ['card', 'link'],
		metadata: {
			destination,
			coinId
		}
	});

	const response: CreatePaymentIntentResponse = {
		paymentIntentId: paymentIntent.client_secret
	};

	return json(response);
};

export const PUT = async (event) => {
	const body: UpdatePaymentIntentBody = await event.request.json();

	console.log('Got update request', body);

	const response: CreatePaymentIntentResponse = {
		paymentIntentId: body.paymentIntentId
	};

	return json(response);
};
