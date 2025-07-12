import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import {
	SECRET_STRIPE_KEY,
	EXCHANGE_RATE_API_KEY,
	PRICING_API_URL,
	PRICING_API_KEY
} from '$env/static/private';
import { ExchangeRateService } from '$lib/services/exchange-rate.service';
import { DynamicPricingService } from '$lib/services/dynamic-pricing.service';
import { TaxCalculationService } from '$lib/services/tax-calculation.service';

// Initialize Stripe with latest API version
const stripe = new Stripe(SECRET_STRIPE_KEY, {
	apiVersion: '2024-12-18.acacia',
	typescript: true
});

// Initialize services
const exchangeRateService = new ExchangeRateService(EXCHANGE_RATE_API_KEY);
const pricingService = new DynamicPricingService(PRICING_API_URL, PRICING_API_KEY);
const taxService = new TaxCalculationService();

// Request validation schema
interface CreatePaymentIntentRequest {
	amount?: number;
	currency?: string;
	destination: 'main' | 'coin' | 'ukraine' | 'donation';
	coinId?: string;
	customerEmail?: string;
	isGift?: boolean;
	referralId?: string;
	returnUrl: string;
	customerInfo?: {
		country: string;
		region?: string;
		postalCode?: string;
		isBusinessCustomer?: boolean;
		vatNumber?: string;
	};
	metadata?: Record<string, string>;
}

interface PaymentIntentResponse {
	clientSecret: string;
	paymentIntentId: string;
	priceBreakdown: {
		subtotal: number;
		discount: number;
		tax: number;
		total: number;
		currency: string;
	};
	expiresAt: string;
}

export const prerender = false;

export const POST = async ({ request, getClientAddress }) => {
	try {
		const clientIP = getClientAddress();
		const body: CreatePaymentIntentRequest = await request.json();

		// Validate required fields
		if (!body.destination || !body.returnUrl) {
			throw error(400, 'Missing required fields: destination and returnUrl');
		}

		// Detect customer region if not provided
		let customerCountry = body.customerInfo?.country || 'US';
		let customerRegion = body.customerInfo?.region;

		// Get dynamic pricing
		const region = getRegionFromCountry(customerCountry);
		const product = getProductFromDestination(body.destination);

		let pricing;
		try {
			pricing = await pricingService.getPricing(region, product);
		} catch (err) {
			console.error('Failed to get dynamic pricing:', err);
			// Use fallback pricing
			pricing = {
				basePrice: 100, // $1.00 fallback
				currency: 'USD',
				discountPercentage: 0,
				validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
				region: 'global',
				source: 'fallback' as const
			};
		}

		// Use provided amount or dynamic pricing
		const baseAmount = body.amount || pricing.basePrice;
		const targetCurrency = body.currency || pricing.currency;

		// Convert currency if needed
		let finalAmount = baseAmount;
		if (pricing.currency !== targetCurrency) {
			try {
				const rate = await exchangeRateService.getRate(pricing.currency, targetCurrency);
				finalAmount = Math.round(baseAmount * rate);
			} catch (err) {
				console.warn('Currency conversion failed, using original amount:', err);
			}
		}

		// Apply discount
		const discountAmount = Math.round(finalAmount * (pricing.discountPercentage / 100));
		const discountedAmount = finalAmount - discountAmount;

		// Calculate tax
		const customerTaxInfo = {
			country: customerCountry,
			region: customerRegion,
			postalCode: body.customerInfo?.postalCode,
			isBusinessCustomer: body.customerInfo?.isBusinessCustomer || false,
			vatNumber: body.customerInfo?.vatNumber
		};

		const taxCalculation = taxService.calculateTax(discountedAmount, customerTaxInfo, product);
		const totalAmount = discountedAmount + taxCalculation.amount;

		// Create Stripe Payment Intent
		const paymentIntent = await stripe.paymentIntents.create({
			amount: totalAmount,
			currency: targetCurrency.toLowerCase(),
			automatic_payment_methods: {
				enabled: true
			},
			customer_email: body.customerEmail,
			receipt_email: body.customerEmail,
			metadata: {
				destination: body.destination,
				coinId: body.coinId || '',
				isGift: body.isGift ? 'true' : 'false',
				referralId: body.referralId || '',
				originalAmount: baseAmount.toString(),
				discountAmount: discountAmount.toString(),
				taxAmount: taxCalculation.amount.toString(),
				taxJurisdiction: taxCalculation.jurisdiction,
				taxType: taxCalculation.type,
				pricingSource: pricing.source,
				clientIP: clientIP,
				...body.metadata
			},
			// Set expiration to 1 hour
			payment_method_options: {
				card: {
					setup_future_usage: 'off_session'
				}
			}
		});

		const response: PaymentIntentResponse = {
			clientSecret: paymentIntent.client_secret!,
			paymentIntentId: paymentIntent.id,
			priceBreakdown: {
				subtotal: finalAmount,
				discount: discountAmount,
				tax: taxCalculation.amount,
				total: totalAmount,
				currency: targetCurrency
			},
			expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
		};

		return json(response);
	} catch (err) {
		console.error('Payment intent creation failed:', err);

		if (err instanceof Error) {
			// Handle known error types
			if (err.message.includes('Invalid API key')) {
				throw error(500, 'Payment service configuration error');
			}
			if (err.message.includes('Invalid currency')) {
				throw error(400, 'Unsupported currency');
			}
			if (err.message.includes('Amount too small')) {
				throw error(400, 'Payment amount too small');
			}
		}

		throw error(500, 'Failed to create payment intent');
	}
};

export const PUT = async ({ request }) => {
	try {
		const body = await request.json();
		const { paymentIntentId, amount, currency = 'USD' } = body;

		if (!paymentIntentId) {
			throw error(400, 'Missing paymentIntentId');
		}

		// Update the payment intent
		const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
			amount: amount * 100, // Convert to cents
			currency: currency.toLowerCase()
		});

		const response = {
			paymentIntentId: updatedPaymentIntent.client_secret,
			status: updatedPaymentIntent.status
		};

		return json(response);
	} catch (err) {
		console.error('Payment intent update failed:', err);
		throw error(500, 'Failed to update payment intent');
	}
};

// Helper functions
function getRegionFromCountry(country: string): string {
	const regionMap: Record<string, string> = {
		US: 'north-america',
		CA: 'north-america',
		GB: 'europe',
		DE: 'europe',
		FR: 'europe',
		IT: 'europe',
		ES: 'europe',
		NL: 'europe',
		AU: 'oceania',
		NZ: 'oceania'
	};

	return regionMap[country] || 'global';
}

function getProductFromDestination(destination: string): string {
	const productMap: Record<string, string> = {
		main: 'digital_service',
		coin: 'digital_collectible',
		ukraine: 'donation',
		donation: 'donation'
	};

	return productMap[destination] || 'digital_service';
}
