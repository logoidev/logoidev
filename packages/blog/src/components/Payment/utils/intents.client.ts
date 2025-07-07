import type {
	CreatePaymentIntentBody,
	CreatePaymentIntentResponse,
	UpdatePaymentIntentBody
} from 'src/routes/payment/types';
import { getStripe } from './stripe';

const STRIPE_BASE_API_HOST = 'https://api.stripe.com/v1/';
const STRIPE_API_BASE = `${STRIPE_BASE_API_HOST}/payment_intents/`;

export const createPaymentIntent = async (body: CreatePaymentIntentBody) => {
	const response = await fetch('/payment', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	const { paymentIntentId }: CreatePaymentIntentResponse = await response.json();

	return paymentIntentId;
};

export const cancelPaymentIntent = (paymentIntent: string) => {
	const stripeCancelIntentId = `${STRIPE_API_BASE}/${paymentIntent}/cancel`;

	console.log(`Canceling, ${stripeCancelIntentId}`);
};

export const updatePaymentIntent = async (updateParams: UpdatePaymentIntentBody) => {
	const stripe = await getStripe();
	if (!stripe) {
		console.error('Could not load stripe instance');
		return;
	}
	const response = await fetch('/payment', {
		method: 'PUT',
		body: JSON.stringify(updateParams)
	});
	const body = await response.json();
	console.log('Called update endpoint', body);
};
