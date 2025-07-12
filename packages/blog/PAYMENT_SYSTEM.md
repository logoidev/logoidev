# Enhanced Payment System Documentation

This document describes the enhanced payment system that integrates Stripe with dynamic pricing, currency exchange, and tax calculation services.

## Overview

The payment system has been completely refactored to provide:

- **Dynamic Pricing**: Fetch pricing from third-party APIs with fallback mechanisms
- **Currency Exchange**: Real-time exchange rates with caching and fallbacks
- **Tax Calculation**: Automatic tax calculation based on customer location and product type
- **Centralized Store**: Reactive Svelte store that manages all payment state
- **Enhanced Error Handling**: Comprehensive error handling with user-friendly messages
- **Type Safety**: Full TypeScript implementation with proper interfaces
- **Performance Optimization**: Intelligent caching and request deduplication

## Architecture

### Core Services

#### 1. ExchangeRateService (`src/lib/services/exchange-rate.service.ts`)
Handles currency exchange rate fetching and caching.

**Features:**
- Real-time exchange rates from exchangerate-api.com
- 1-hour caching with automatic refresh
- Fallback rates for offline scenarios
- Timeout protection (5 seconds)
- Proper error handling and logging

**Usage:**
```typescript
const exchangeService = new ExchangeRateService(API_KEY);
const rate = await exchangeService.getRate('USD', 'EUR');
```

#### 2. DynamicPricingService (`src/lib/services/dynamic-pricing.service.ts`)
Fetches dynamic pricing from third-party APIs.

**Features:**
- 15-minute pricing cache
- Configurable fallback pricing
- Currency conversion integration
- Price validation and normalization
- Region-based pricing support

**Usage:**
```typescript
const pricingService = new DynamicPricingService(API_URL, API_KEY);
const pricing = await pricingService.getPricing('north-america', 'digital_service');
```

#### 3. TaxCalculationService (`src/lib/services/tax-calculation.service.ts`)
Calculates taxes based on customer location and product type.

**Features:**
- Support for VAT, Sales Tax, and GST
- Jurisdiction-specific tax rules
- Business exemption handling
- VAT number validation
- Product-type exemptions

**Usage:**
```typescript
const taxService = new TaxCalculationService();
const tax = taxService.calculateTax(amount, customerInfo, 'digital_service');
```

### Centralized Store

#### PricingStore (`src/lib/stores/pricing.store.ts`)
Reactive Svelte store that integrates all services.

**Features:**
- Reactive state management
- Automatic price recalculation
- Customer info management
- Periodic data refresh
- Error state handling

**Usage:**
```typescript
import { pricingStore, pricingActions } from '$lib/stores/pricing.store';

// Set customer info
pricingActions.setCustomerInfo({
  country: 'US',
  region: 'CA',
  isBusinessCustomer: false
});

// Subscribe to price changes
pricingStore.subscribe(state => {
  console.log('Current pricing:', state.priceBreakdown);
});
```

## Implementation Guide

### 1. Environment Setup

Add these environment variables to your `.env` file:

```bash
# Stripe Configuration
PUBLIC_STRIPE_KEY=pk_test_...
SECRET_STRIPE_KEY=sk_test_...

# Exchange Rate API
EXCHANGE_RATE_API_KEY=your_exchangerate_api_key

# Dynamic Pricing API
PRICING_API_URL=https://your-pricing-api.com/pricing
PRICING_API_KEY=your_pricing_api_key
```

### 2. Server-Side Integration

The payment server (`src/routes/payment/+server.ts`) now:

- Integrates all three services
- Calculates comprehensive price breakdowns
- Handles multiple currencies
- Applies region-specific pricing
- Includes tax calculation in payment intents

**Request Format:**
```typescript
interface PaymentRequest {
  amount?: number; // Optional - uses dynamic pricing if not provided
  currency?: string; // Defaults to USD
  destination: 'main' | 'coin' | 'ukraine' | 'donation';
  coinId?: string;
  customerEmail?: string;
  returnUrl: string;
  customerInfo?: {
    country: string;
    region?: string;
    postalCode?: string;
    isBusinessCustomer?: boolean;
    vatNumber?: string;
  };
}
```

**Response Format:**
```typescript
interface PaymentResponse {
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
```

### 3. Client-Side Integration

#### Enhanced Payment Component

Use the new `EnhancedPayment.svelte` component:

```svelte
<script>
  import EnhancedPayment from '$lib/components/Payment/EnhancedPayment.svelte';
</script>

<EnhancedPayment
  destination="main"
  to="Your Organization"
  customerCountry="US"
  customerRegion="CA"
  currency="USD"
  on:success={(event) => {
    console.log('Payment successful:', event.detail);
  }}
/>
```

#### Store Integration

For custom implementations, use the pricing store:

```svelte
<script>
  import { pricingStore, pricingActions } from '$lib/stores/pricing.store';
  
  // Initialize customer info
  pricingActions.setCustomerInfo({
    country: 'GB',
    isBusinessCustomer: false
  });
  
  // Subscribe to pricing updates
  $: priceBreakdown = $pricingStore.priceBreakdown;
</script>

{#if priceBreakdown}
  <div>
    <p>Subtotal: {formatCurrency(priceBreakdown.subtotal, priceBreakdown.currency)}</p>
    <p>Tax: {formatCurrency(priceBreakdown.tax, priceBreakdown.currency)}</p>
    <p>Total: {formatCurrency(priceBreakdown.total, priceBreakdown.currency)}</p>
  </div>
{/if}
```

## Configuration

### Tax Rules

Tax rules are configured in `TaxCalculationService`. You can update them:

```typescript
// Add custom tax rule
taxService.updateTaxRules([
  {
    jurisdiction: 'US-WA',
    type: 'sales_tax',
    rate: 10.4,
    threshold: 0
  }
]);
```

### Pricing Fallbacks

Configure fallback pricing in `DynamicPricingService`:

```typescript
pricingService.updateFallbackPricing({
  basePrice: 299, // $2.99
  currency: 'USD',
  discountPercentage: 0
});
```

### Exchange Rate Fallbacks

Exchange rates include hardcoded fallbacks in case the API is unavailable:

```typescript
const fallbacks = {
  'USD-GBP': 0.79,
  'USD-EUR': 0.85,
  'USD-CAD': 1.25,
  // ... more rates
};
```

## Error Handling

The system includes comprehensive error handling:

### Service-Level Errors
- Network timeouts (5 seconds for exchange rates, 3 seconds for pricing)
- API failures with fallback mechanisms
- Data validation errors
- Rate limiting protection

### User-Facing Errors
- Clear error messages for payment failures
- Graceful degradation when services are unavailable
- Retry mechanisms for transient failures
- Proper loading states

### Monitoring
All services include detailed logging:

```typescript
// Exchange rate fetch failure
console.error(`Exchange rate fetch failed for USD-EUR:`, error);

// Pricing API failure
console.error(`Dynamic pricing fetch failed for north-america-digital_service:`, error);

// Tax calculation error
console.error('Tax calculation failed:', error);
```

## Performance Optimization

### Caching Strategy
- **Exchange Rates**: 1-hour cache with automatic refresh
- **Dynamic Pricing**: 15-minute cache with stale-while-revalidate
- **Tax Rules**: 24-hour cache with periodic updates

### Request Optimization
- Request deduplication for concurrent calls
- Timeout protection to prevent hanging requests
- Fallback mechanisms to ensure fast responses

### Client-Side Optimization
- Automatic refresh every 15 minutes
- Reactive updates only when data changes
- Minimal re-renders with proper Svelte stores

## Testing

### Unit Tests
Test each service independently:

```typescript
describe('ExchangeRateService', () => {
  it('should fetch exchange rates', async () => {
    const service = new ExchangeRateService('test-key');
    const rate = await service.getRate('USD', 'EUR');
    expect(rate).toBeGreaterThan(0);
  });
});
```

### Integration Tests
Test the complete payment flow:

```typescript
describe('Payment Flow', () => {
  it('should create payment intent with tax calculation', async () => {
    const response = await fetch('/payment', {
      method: 'POST',
      body: JSON.stringify({
        destination: 'main',
        returnUrl: 'http://localhost:5173',
        customerInfo: { country: 'US', region: 'CA' }
      })
    });
    
    const data = await response.json();
    expect(data.priceBreakdown.tax).toBeGreaterThan(0);
  });
});
```

## Security Considerations

### API Key Protection
- All API keys are server-side only
- No sensitive data exposed to client
- Proper environment variable handling

### Input Validation
- All user inputs are validated
- SQL injection prevention
- XSS protection in client components

### Payment Security
- PCI compliance through Stripe
- No card data stored locally
- Proper HTTPS enforcement

## Deployment

### Development
```bash
# Install dependencies
pnpm install

# Set environment variables
cp .env.base .env.local
# Edit .env.local with your API keys

# Start development server
pnpm dev
```

### Production
```bash
# Build the application
pnpm build

# Set production environment variables
# Deploy with your preferred hosting service
```

## Migration Guide

If migrating from the old payment system:

1. **Update Environment Variables**: Add the new API keys
2. **Replace Components**: Switch to `EnhancedPayment.svelte`
3. **Update API Calls**: Use the new request/response format
4. **Test Thoroughly**: Verify tax calculations and currency conversions
5. **Monitor**: Watch logs for any integration issues

## Troubleshooting

### Common Issues

1. **Exchange Rate API Fails**
   - Check API key validity
   - Verify network connectivity
   - Review rate limits

2. **Tax Calculation Errors**
   - Verify customer country format
   - Check product type configuration
   - Review tax rule setup

3. **Payment Intent Creation Fails**
   - Validate Stripe configuration
   - Check amount minimums
   - Verify currency support

### Debug Tools

Use the service statistics for debugging:

```typescript
const stats = pricingActions.getServiceStats();
console.log('Exchange rates cached:', stats.exchangeRates);
console.log('Pricing cache:', stats.pricing);
console.log('Tax jurisdictions:', stats.taxJurisdictions);
```

## Support

For issues or questions:
- Check the error logs first
- Review this documentation
- Test with the fallback mechanisms
- Contact the development team with specific error messages

This enhanced payment system provides a robust, scalable foundation for handling complex payment scenarios with proper error handling, caching, and user experience considerations.