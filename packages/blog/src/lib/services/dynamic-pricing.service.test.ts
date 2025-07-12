import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DynamicPricingService } from './dynamic-pricing.service';

// Mock global fetch
const mockFetch = vi.fn();
(globalThis as any).fetch = mockFetch;

describe('DynamicPricingService', () => {
  let service: DynamicPricingService;
  const mockApiUrl = 'https://test-pricing-api.com/pricing';
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    service = new DynamicPricingService(mockApiUrl, mockApiKey);
    vi.clearAllMocks();
  });

  afterEach(() => {
    service.clearCache();
  });

  describe('getPricing', () => {
    it('should fetch pricing from API', async () => {
      const mockResponse = {
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        region: 'north-america',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const pricing = await service.getPricing('north-america', 'digital_service');

      expect(pricing).toMatchObject({
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        region: 'north-america',
        source: 'api',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(mockApiUrl),
        expect.objectContaining({
          headers: {
            'Authorization': `Bearer ${mockApiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'LogoiPaymentSystem/1.0',
          },
        })
      );
    });

    it('should return cached pricing when available and valid', async () => {
      const mockResponse = {
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        region: 'north-america',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // First call - should fetch from API
      const pricing1 = await service.getPricing('north-america', 'digital_service');
      expect(pricing1.source).toBe('api');
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const pricing2 = await service.getPricing('north-america', 'digital_service');
      expect(pricing2.source).toBe('api');
      expect(mockFetch).toHaveBeenCalledTimes(1); // No additional API call
    });

    it('should return fallback pricing when API fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const pricing = await service.getPricing('europe', 'digital_service');

      expect(pricing).toMatchObject({
        basePrice: 100,
        currency: 'USD',
        discountPercentage: 0,
        region: 'europe',
        source: 'fallback',
      });
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const pricing = await service.getPricing('global', 'digital_service');

      expect(pricing.source).toBe('fallback');
    });

    it('should validate pricing response', async () => {
      const invalidResponse = {
        basePrice: -100, // Invalid negative price
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        region: 'north-america',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const pricing = await service.getPricing('north-america', 'digital_service');

      expect(pricing.source).toBe('fallback');
    });

    it('should handle invalid currency in response', async () => {
      const invalidResponse = {
        basePrice: 100,
        currency: 'INVALID', // Invalid currency code
        discountPercentage: 10,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        region: 'north-america',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const pricing = await service.getPricing('north-america', 'digital_service');

      expect(pricing.source).toBe('fallback');
    });

    it('should handle invalid discount percentage', async () => {
      const invalidResponse = {
        basePrice: 100,
        currency: 'USD',
        discountPercentage: 150, // Invalid percentage > 100
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        region: 'north-america',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const pricing = await service.getPricing('north-america', 'digital_service');

      expect(pricing.discountPercentage).toBe(100); // Should be clamped to 100
    });

    it('should handle expired validUntil date', async () => {
      const invalidResponse = {
        basePrice: 100,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
        region: 'north-america',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const pricing = await service.getPricing('north-america', 'digital_service');

      expect(pricing.source).toBe('fallback');
    });

    it('should return stale cached pricing when API fails', async () => {
      const mockResponse = {
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        region: 'north-america',
      };

      // First successful call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await service.getPricing('north-america', 'digital_service');

      // Second call with API failure
      mockFetch.mockRejectedValueOnce(new Error('API error'));

      const pricing = await service.getPricing('north-america', 'digital_service');

      expect(pricing.source).toBe('cache');
    });
  });

  describe('calculateFinalPrice', () => {
    it('should calculate final price with discount', () => {
      const pricing = {
        basePrice: 1000,
        currency: 'USD',
        discountPercentage: 20,
        validUntil: new Date(),
        region: 'global',
        source: 'api' as const,
      };

      const finalPrice = service.calculateFinalPrice(pricing);

      expect(finalPrice).toBe(800); // 1000 - (1000 * 0.20)
    });

    it('should handle zero discount', () => {
      const pricing = {
        basePrice: 1000,
        currency: 'USD',
        discountPercentage: 0,
        validUntil: new Date(),
        region: 'global',
        source: 'api' as const,
      };

      const finalPrice = service.calculateFinalPrice(pricing);

      expect(finalPrice).toBe(1000);
    });

    it('should handle 100% discount', () => {
      const pricing = {
        basePrice: 1000,
        currency: 'USD',
        discountPercentage: 100,
        validUntil: new Date(),
        region: 'global',
        source: 'api' as const,
      };

      const finalPrice = service.calculateFinalPrice(pricing);

      expect(finalPrice).toBe(0);
    });

    it('should round final price to nearest cent', () => {
      const pricing = {
        basePrice: 999,
        currency: 'USD',
        discountPercentage: 33.33,
        validUntil: new Date(),
        region: 'global',
        source: 'api' as const,
      };

      const finalPrice = service.calculateFinalPrice(pricing);

      expect(finalPrice).toBe(666); // Rounded
    });
  });

  describe('getPricingWithCurrency', () => {
    const mockExchangeRateService = {
      getRate: vi.fn(),
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return pricing without conversion for same currency', async () => {
      const mockResponse = {
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        region: 'north-america',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const pricing = await service.getPricingWithCurrency(
        'north-america',
        'USD',
        mockExchangeRateService,
        'digital_service'
      );

      expect(pricing.currency).toBe('USD');
      expect(pricing.basePrice).toBe(299);
      expect(mockExchangeRateService.getRate).not.toHaveBeenCalled();
    });

    it('should convert pricing to target currency', async () => {
      const mockResponse = {
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        region: 'north-america',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      mockExchangeRateService.getRate.mockResolvedValueOnce(0.85); // USD to EUR

      const pricing = await service.getPricingWithCurrency(
        'north-america',
        'EUR',
        mockExchangeRateService,
        'digital_service'
      );

      expect(pricing.currency).toBe('EUR');
      expect(pricing.basePrice).toBe(Math.round(299 * 0.85));
      expect(mockExchangeRateService.getRate).toHaveBeenCalledWith('USD', 'EUR');
    });

    it('should return original pricing when currency conversion fails', async () => {
      const mockResponse = {
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        region: 'north-america',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      mockExchangeRateService.getRate.mockRejectedValueOnce(new Error('Exchange rate API error'));

      const pricing = await service.getPricingWithCurrency(
        'north-america',
        'EUR',
        mockExchangeRateService,
        'digital_service'
      );

      expect(pricing.currency).toBe('USD'); // Original currency
      expect(pricing.basePrice).toBe(299); // Original price
    });
  });

  describe('cache management', () => {
    it('should clear cache', async () => {
      const mockResponse = {
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        region: 'north-america',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await service.getPricing('north-america', 'digital_service');

      let stats = service.getCacheStats();
      expect(stats.size).toBe(1);

      service.clearCache();

      stats = service.getCacheStats();
      expect(stats.size).toBe(0);
    });

    it('should return cache statistics', async () => {
      const stats = service.getCacheStats();
      expect(stats).toMatchObject({
        size: 0,
        entries: [],
      });

      const mockResponse = {
        basePrice: 299,
        currency: 'USD',
        discountPercentage: 10,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        region: 'north-america',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await service.getPricing('north-america', 'digital_service');

      const newStats = service.getCacheStats();
      expect(newStats.size).toBe(1);
      expect(newStats.entries).toHaveLength(1);
      expect(newStats.entries[0]).toMatchObject({
        key: 'north-america-digital_service',
        source: 'api',
      });
    });

    it('should update fallback pricing', () => {
      const newFallback = {
        basePrice: 500,
        currency: 'EUR',
        discountPercentage: 15,
      };

      service.updateFallbackPricing(newFallback);

      // Test by triggering fallback
      mockFetch.mockRejectedValueOnce(new Error('API error'));

      return service.getPricing('test-region').then(pricing => {
        expect(pricing).toMatchObject({
          basePrice: 500,
          currency: 'EUR',
          discountPercentage: 15,
          source: 'fallback',
        });
      });
    });
  });

  describe('error handling', () => {
    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const pricing = await service.getPricing('north-america', 'digital_service');

      expect(pricing.source).toBe('fallback');
    });

    it('should handle network timeout', async () => {
      mockFetch.mockImplementationOnce(() =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      const pricing = await service.getPricing('north-america', 'digital_service');

      expect(pricing.source).toBe('fallback');
    });

    it('should handle missing required fields in response', async () => {
      const incompleteResponse = {
        basePrice: 299,
        // Missing currency, discountPercentage, validUntil
        region: 'north-america',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(incompleteResponse),
      });

      const pricing = await service.getPricing('north-america', 'digital_service');

      expect(pricing.source).toBe('fallback');
    });
  });
});