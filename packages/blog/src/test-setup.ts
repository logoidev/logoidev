import { vi } from 'vitest';

// Mock environment variables
vi.mock('$env/static/private', () => ({
  SECRET_STRIPE_KEY: 'sk_test_mock',
  EXCHANGE_RATE_API_KEY: 'test_exchange_api_key',
  PRICING_API_URL: 'https://test-pricing-api.com',
  PRICING_API_KEY: 'test_pricing_api_key',
}));

vi.mock('$env/static/public', () => ({
  PUBLIC_STRIPE_KEY: 'pk_test_mock',
}));

// Mock browser environment
vi.mock('$app/environment', () => ({
  browser: false,
  dev: true,
}));

// Mock SvelteKit stores
vi.mock('$app/stores', () => ({
  page: {
    subscribe: vi.fn(),
  },
}));

// Global test utilities
global.fetch = vi.fn();

// Mock setTimeout and clearTimeout for consistent testing
global.setTimeout = vi.fn((cb) => cb()) as any;
global.clearTimeout = vi.fn();

// Setup common test data
export const mockExchangeRateResponse = {
  result: 'success',
  conversion_rate: 0.85,
  time_last_update_unix: 1640995200,
  time_next_update_unix: 1641081600,
};

export const mockPricingResponse = {
  basePrice: 100,
  currency: 'USD',
  discountPercentage: 10,
  validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  region: 'north-america',
};

export const mockCustomerInfo = {
  country: 'US',
  region: 'CA',
  isBusinessCustomer: false,
};

export const mockStripePaymentIntent = {
  id: 'pi_test_123',
  client_secret: 'pi_test_123_secret',
  amount: 1000,
  currency: 'usd',
  status: 'requires_payment_method',
  metadata: {},
};