import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { 
  priceBreakdown, 
  dynamicPricing, 
  taxCalculation, 
  currency, 
  customerInfo, 
  isLoading, 
  error,
  updateCustomerInfo,
  updateCurrency,
  calculatePricing,
  resetPricingStore
} from './pricing.store';

// Mock the services
vi.mock('../services/exchange-rate.service', () => ({
  ExchangeRateService: vi.fn().mockImplementation(() => ({
    getRate: vi.fn().mockResolvedValue(0.85),
    clearCache: vi.fn(),
    getCacheStats: vi.fn().mockReturnValue({ size: 0, oldestEntry: null }),
  })),
}));

vi.mock('../services/dynamic-pricing.service', () => ({
  DynamicPricingService: vi.fn().mockImplementation(() => ({
    getPricing: vi.fn().mockResolvedValue({
      basePrice: 299,
      currency: 'USD',
      discountPercentage: 10,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      region: 'north-america',
      source: 'api',
    }),
    getPricingWithCurrency: vi.fn().mockResolvedValue({
      basePrice: 254,
      currency: 'EUR',
      discountPercentage: 10,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      region: 'north-america',
      source: 'api',
    }),
    clearCache: vi.fn(),
    getCacheStats: vi.fn().mockReturnValue({ size: 0, entries: [] }),
  })),
}));

vi.mock('../services/tax-calculation.service', () => ({
  TaxCalculationService: vi.fn().mockImplementation(() => ({
    calculateTax: vi.fn().mockReturnValue({
      rate: 8.75,
      amount: 88,
      jurisdiction: 'US-CA',
      type: 'sales_tax',
    }),
    calculateTaxWithExemptions: vi.fn().mockReturnValue({
      rate: 8.75,
      amount: 88,
      jurisdiction: 'US-CA',
      type: 'sales_tax',
    }),
  })),
}));

// Mock environment
vi.mock('$app/environment', () => ({
  browser: false,
}));

describe('Pricing Store', () => {
  beforeEach(() => {
    resetPricingStore();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      expect(get(priceBreakdown)).toEqual({
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        currency: 'USD',
      });

      expect(get(dynamicPricing)).toBeNull();
      expect(get(taxCalculation)).toBeNull();
      expect(get(currency)).toBe('USD');
      expect(get(customerInfo)).toBeNull();
      expect(get(isLoading)).toBe(false);
      expect(get(error)).toBeNull();
    });
  });

  describe('updateCustomerInfo', () => {
    it('should update customer info and trigger pricing recalculation', async () => {
      const newCustomerInfo = {
        country: 'US',
        region: 'CA',
        postalCode: '90210',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(newCustomerInfo);

      expect(get(customerInfo)).toEqual(newCustomerInfo);
      expect(get(isLoading)).toBe(false);
      expect(get(error)).toBeNull();
    });

    it('should handle null customer info', async () => {
      await updateCustomerInfo(null);

      expect(get(customerInfo)).toBeNull();
      expect(get(priceBreakdown)).toEqual({
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        currency: 'USD',
      });
    });
  });

  describe('updateCurrency', () => {
    it('should update currency and trigger pricing recalculation', async () => {
      await updateCurrency('EUR');

      expect(get(currency)).toBe('EUR');
      expect(get(isLoading)).toBe(false);
    });

    it('should handle invalid currency', async () => {
      await updateCurrency('INVALID' as any);

      expect(get(currency)).toBe('USD'); // Should default to USD
      expect(get(error)).toBe('Invalid currency: INVALID');
    });

    it('should not update if currency is the same', async () => {
      await updateCurrency('USD');

      expect(get(currency)).toBe('USD');
      expect(get(isLoading)).toBe(false);
    });
  });

  describe('calculatePricing', () => {
    it('should calculate pricing with all services', async () => {
      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        postalCode: '90210',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);
      await calculatePricing('north-america', 'digital_service');

      expect(get(isLoading)).toBe(false);
      expect(get(error)).toBeNull();
      expect(get(dynamicPricing)).toMatchObject({
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        region: 'north-america',
        source: 'api',
      });
      expect(get(taxCalculation)).toMatchObject({
        rate: 8.75,
        amount: 88,
        jurisdiction: 'US-CA',
        type: 'sales_tax',
      });
    });

    it('should calculate pricing with currency conversion', async () => {
      const mockCustomerInfo = {
        country: 'DE',
        postalCode: '10115',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);
      await updateCurrency('EUR');
      await calculatePricing('europe', 'digital_service');

      expect(get(isLoading)).toBe(false);
      expect(get(error)).toBeNull();
      expect(get(dynamicPricing)).toMatchObject({
        basePrice: 254,
        currency: 'EUR',
        discountPercentage: 10,
        region: 'europe',
        source: 'api',
      });
    });

    it('should handle pricing calculation errors', async () => {
      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      // Mock service to throw error
      const mockError = new Error('Pricing API error');
      vi.mocked(vi.fn().mockRejectedValue(mockError));

      await updateCustomerInfo(mockCustomerInfo);
      await calculatePricing('north-america', 'digital_service');

      expect(get(isLoading)).toBe(false);
      expect(get(error)).toBe('Failed to calculate pricing: Pricing API error');
    });

    it('should handle empty region', async () => {
      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);
      await calculatePricing('', 'digital_service');

      expect(get(isLoading)).toBe(false);
      expect(get(error)).toBe('Region is required for pricing calculation');
    });

    it('should handle empty product type', async () => {
      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);
      await calculatePricing('north-america', '');

      expect(get(isLoading)).toBe(false);
      expect(get(error)).toBe('Product type is required for pricing calculation');
    });
  });

  describe('reactive price breakdown', () => {
    it('should update price breakdown when pricing changes', async () => {
      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);
      await calculatePricing('north-america', 'digital_service');

      const breakdown = get(priceBreakdown);
      expect(breakdown.subtotal).toBe(299);
      expect(breakdown.discount).toBe(30); // 10% of 299
      expect(breakdown.tax).toBe(88);
      expect(breakdown.total).toBe(357); // 299 - 30 + 88
      expect(breakdown.currency).toBe('USD');
    });

    it('should handle zero pricing', async () => {
      // Mock service to return zero pricing
      vi.mocked(vi.fn().mockResolvedValue({
        basePrice: 0,
        currency: 'USD',
        discountPercentage: 0,
        validUntil: new Date(),
        region: 'global',
        source: 'api',
      }));

      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);
      await calculatePricing('global', 'free_service');

      const breakdown = get(priceBreakdown);
      expect(breakdown.subtotal).toBe(0);
      expect(breakdown.discount).toBe(0);
      expect(breakdown.tax).toBe(0);
      expect(breakdown.total).toBe(0);
    });

    it('should handle 100% discount', async () => {
      // Mock service to return 100% discount
      vi.mocked(vi.fn().mockResolvedValue({
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 100,
        validUntil: new Date(),
        region: 'global',
        source: 'api',
      }));

      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);
      await calculatePricing('global', 'promotional_service');

      const breakdown = get(priceBreakdown);
      expect(breakdown.subtotal).toBe(299);
      expect(breakdown.discount).toBe(299);
      expect(breakdown.tax).toBe(0); // No tax on free item
      expect(breakdown.total).toBe(0);
    });
  });

  describe('loading states', () => {
    it('should show loading state during pricing calculation', async () => {
      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);

      // Mock service to return a delayed promise
      let resolvePromise: any;
      const delayedPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(vi.fn().mockReturnValue(delayedPromise));

      const calculationPromise = calculatePricing('north-america', 'digital_service');

      expect(get(isLoading)).toBe(true);

      resolvePromise({
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(),
        region: 'north-america',
        source: 'api',
      });

      await calculationPromise;

      expect(get(isLoading)).toBe(false);
    });

    it('should clear loading state on error', async () => {
      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);

      // Mock service to throw error
      const mockError = new Error('Network error');
      vi.mocked(vi.fn().mockRejectedValue(mockError));

      await calculatePricing('north-america', 'digital_service');

      expect(get(isLoading)).toBe(false);
      expect(get(error)).toBe('Failed to calculate pricing: Network error');
    });
  });

  describe('error handling', () => {
    it('should clear previous errors on new calculation', async () => {
      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);

      // First calculation with error
      const mockError = new Error('First error');
      vi.mocked(vi.fn().mockRejectedValueOnce(mockError));

      await calculatePricing('north-america', 'digital_service');
      expect(get(error)).toBe('Failed to calculate pricing: First error');

      // Second calculation successful
      vi.mocked(vi.fn().mockResolvedValueOnce({
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(),
        region: 'north-america',
        source: 'api',
      }));

      await calculatePricing('north-america', 'digital_service');
      expect(get(error)).toBeNull();
    });

    it('should handle service initialization errors', async () => {
      // Mock service constructor to throw
      vi.mocked(vi.fn()).mockImplementation(() => {
        throw new Error('Service initialization failed');
      });

      await calculatePricing('north-america', 'digital_service');

      expect(get(error)).toBe('Failed to calculate pricing: Service initialization failed');
    });
  });

  describe('store subscriptions', () => {
    it('should notify subscribers when pricing changes', async () => {
      const mockSubscriber = vi.fn();
      const unsubscribe = priceBreakdown.subscribe(mockSubscriber);

      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);
      await calculatePricing('north-america', 'digital_service');

      expect(mockSubscriber).toHaveBeenCalledWith(
        expect.objectContaining({
          subtotal: 299,
          discount: 30,
          tax: 88,
          total: 357,
          currency: 'USD',
        })
      );

      unsubscribe();
    });

    it('should notify subscribers when currency changes', async () => {
      const mockSubscriber = vi.fn();
      const unsubscribe = currency.subscribe(mockSubscriber);

      await updateCurrency('EUR');

      expect(mockSubscriber).toHaveBeenCalledWith('EUR');

      unsubscribe();
    });

    it('should notify subscribers when customer info changes', async () => {
      const mockSubscriber = vi.fn();
      const unsubscribe = customerInfo.subscribe(mockSubscriber);

      const newCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(newCustomerInfo);

      expect(mockSubscriber).toHaveBeenCalledWith(newCustomerInfo);

      unsubscribe();
    });

    it('should notify subscribers when loading state changes', async () => {
      const mockSubscriber = vi.fn();
      const unsubscribe = isLoading.subscribe(mockSubscriber);

      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);

      // Mock delayed promise
      let resolvePromise: any;
      const delayedPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(vi.fn().mockReturnValue(delayedPromise));

      const calculationPromise = calculatePricing('north-america', 'digital_service');

      expect(mockSubscriber).toHaveBeenCalledWith(true);

      resolvePromise({
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(),
        region: 'north-america',
        source: 'api',
      });

      await calculationPromise;

      expect(mockSubscriber).toHaveBeenCalledWith(false);

      unsubscribe();
    });
  });

  describe('resetPricingStore', () => {
    it('should reset all store values to initial state', async () => {
      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);
      await updateCurrency('EUR');
      await calculatePricing('north-america', 'digital_service');

      // Verify values are changed
      expect(get(customerInfo)).not.toBeNull();
      expect(get(currency)).toBe('EUR');
      expect(get(dynamicPricing)).not.toBeNull();

      resetPricingStore();

      // Verify values are reset
      expect(get(customerInfo)).toBeNull();
      expect(get(currency)).toBe('USD');
      expect(get(dynamicPricing)).toBeNull();
      expect(get(taxCalculation)).toBeNull();
      expect(get(priceBreakdown)).toEqual({
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        currency: 'USD',
      });
      expect(get(isLoading)).toBe(false);
      expect(get(error)).toBeNull();
    });
  });

  describe('derived stores', () => {
    it('should calculate price breakdown reactively', async () => {
      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);
      await calculatePricing('north-america', 'digital_service');

      const breakdown = get(priceBreakdown);
      expect(breakdown.subtotal).toBe(299);
      expect(breakdown.discount).toBe(30);
      expect(breakdown.tax).toBe(88);
      expect(breakdown.total).toBe(357);
      expect(breakdown.currency).toBe('USD');
    });

    it('should handle null dynamic pricing', () => {
      const breakdown = get(priceBreakdown);
      expect(breakdown.subtotal).toBe(0);
      expect(breakdown.discount).toBe(0);
      expect(breakdown.tax).toBe(0);
      expect(breakdown.total).toBe(0);
      expect(breakdown.currency).toBe('USD');
    });

    it('should handle null tax calculation', async () => {
      // Mock pricing service but not tax service
      vi.mocked(vi.fn().mockResolvedValue({
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(),
        region: 'north-america',
        source: 'api',
      }));

      vi.mocked(vi.fn().mockReturnValue(null));

      const mockCustomerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      await updateCustomerInfo(mockCustomerInfo);
      await calculatePricing('north-america', 'digital_service');

      const breakdown = get(priceBreakdown);
      expect(breakdown.subtotal).toBe(299);
      expect(breakdown.discount).toBe(30);
      expect(breakdown.tax).toBe(0); // No tax calculation
      expect(breakdown.total).toBe(269); // 299 - 30 + 0
    });
  });
});