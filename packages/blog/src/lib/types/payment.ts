import { z } from 'zod';
import type { Stripe } from 'stripe';

// Currency and Exchange Rate Types
export type SupportedCurrency = 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD';
export type CountryCode = 'US' | 'GB' | 'EU' | 'CA' | 'AU';

export interface ExchangeRate {
  fromCurrency: SupportedCurrency;
  toCurrency: SupportedCurrency;
  rate: number;
  lastUpdated: Date;
  expiresAt: Date;
}

// Pricing Types
export interface PriceBreakdown {
  subtotal: number; // in cents
  discount: number; // in cents
  tax: number; // in cents
  total: number; // in cents
  currency: SupportedCurrency;
}

export interface DynamicPricing {
  basePrice: number; // in cents
  currency: SupportedCurrency;
  discountPercentage: number;
  validUntil: Date;
  region: string;
  source: 'api' | 'fallback' | 'cache';
}

// Tax Types
export interface TaxCalculation {
  rate: number; // percentage
  amount: number; // in cents
  jurisdiction: string;
  type: 'vat' | 'sales_tax' | 'gst' | 'none';
}

// Payment Intent Types
export const createPaymentIntentSchema = z.object({
  amount: z.number().min(50).max(999999), // $0.50 to $9,999.99
  currency: z.enum(['USD', 'GBP', 'EUR', 'CAD', 'AUD']),
  destination: z.enum(['main', 'coin', 'ukraine', 'donation']),
  coinId: z.string().optional(),
  customerEmail: z.string().email().optional(),
  isGift: z.boolean().default(false),
  referralId: z.string().uuid().optional(),
  returnUrl: z.string().url(),
  metadata: z.record(z.string()).optional()
});

export type CreatePaymentIntentRequest = z.infer<typeof createPaymentIntentSchema>;

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  priceBreakdown: PriceBreakdown;
  expiresAt: Date;
}

// Error Types
export enum PaymentErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  STRIPE_API_ERROR = 'STRIPE_API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  PRICING_API_ERROR = 'PRICING_API_ERROR',
  EXCHANGE_RATE_ERROR = 'EXCHANGE_RATE_ERROR',
  TAX_CALCULATION_ERROR = 'TAX_CALCULATION_ERROR'
}

export class PaymentError extends Error {
  constructor(
    public type: PaymentErrorType,
    message: string,
    public details?: any,
    public userMessage?: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

// Stripe Configuration Types
export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  apiVersion: Stripe.LatestApiVersion;
  paymentMethodConfigId: string;
  giftPaymentMethodConfigId: string;
}

// Store Types
export interface PricingStoreState {
  pricing: DynamicPricing | null;
  exchangeRates: Map<string, ExchangeRate>;
  taxRates: Map<string, TaxCalculation>;
  loading: boolean;
  error: PaymentError | null;
  lastUpdated: Date | null;
}

// API Response Types
export interface PricingApiResponse {
  basePrice: number;
  currency: SupportedCurrency;
  discountPercentage: number;
  validUntil: string; // ISO date string
  region: string;
  metadata?: Record<string, any>;
}

export interface ExchangeRateApiResponse {
  result: 'success' | 'error';
  conversion_rate: number;
  time_last_update_unix: number;
  time_next_update_unix: number;
  error?: string;
}