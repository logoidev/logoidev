import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ExchangeRateService } from './exchange-rate.service';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    service = new ExchangeRateService(mockApiKey);
    vi.clearAllMocks();
  });

  afterEach(() => {
    service.clearCache();
  });

  describe('getRate', () => {
    it('should return 1 for same currency', async () => {
      const rate = await service.getRate('USD', 'USD');
      expect(rate).toBe(1);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should fetch exchange rate from API', async () => {
      const mockResponse = {
        result: 'success',
        conversion_rate: 0.85,
        time_last_update_unix: 1640995200,
        time_next_update_unix: 1641081600,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const rate = await service.getRate('USD', 'EUR');

      expect(rate).toBe(0.85);
      expect(mockFetch).toHaveBeenCalledWith(
        `https://v6.exchangerate-api.com/v6/${mockApiKey}/pair/USD/EUR`,
        expect.objectContaining({
          headers: {
            'User-Agent': 'LogoiPaymentSystem/1.0',
            'Accept': 'application/json',
          },
        })
      );
    });

    it('should return cached rate when available and valid', async () => {
      const mockResponse = {
        result: 'success',
        conversion_rate: 0.85,
        time_last_update_unix: 1640995200,
        time_next_update_unix: 1641081600,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      // First call - should fetch from API
      const rate1 = await service.getRate('USD', 'EUR');
      expect(rate1).toBe(0.85);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const rate2 = await service.getRate('USD', 'EUR');
      expect(rate2).toBe(0.85);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No additional API call
    });

    it('should handle API errors and return fallback rate', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const rate = await service.getRate('USD', 'GBP');

      expect(rate).toBe(0.79); // Fallback rate
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const rate = await service.getRate('USD', 'EUR');

      expect(rate).toBe(0.85); // Fallback rate
    });

    it('should handle API response errors', async () => {
      const mockResponse = {
        result: 'error',
        error: 'invalid-key',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const rate = await service.getRate('USD', 'EUR');

      expect(rate).toBe(0.85); // Fallback rate
    });

    it('should handle invalid conversion rate', async () => {
      const mockResponse = {
        result: 'success',
        conversion_rate: -1, // Invalid rate
        time_last_update_unix: 1640995200,
        time_next_update_unix: 1641081600,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const rate = await service.getRate('USD', 'EUR');

      expect(rate).toBe(0.85); // Fallback rate
    });

    it('should use reverse fallback rate when available', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const rate = await service.getRate('GBP', 'USD');

      expect(rate).toBeCloseTo(1 / 0.79, 2); // Reverse of USD-GBP fallback
    });

    it('should return 1.0 for unknown currency pairs', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const rate = await service.getRate('XXX', 'YYY');

      expect(rate).toBe(1.0);
    });

    it('should handle request timeout', async () => {
      // Mock a timeout scenario
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      const rate = await service.getRate('USD', 'EUR');

      expect(rate).toBe(0.85); // Fallback rate
    });

    it('should return stale cached rate when API fails', async () => {
      const mockResponse = {
        result: 'success',
        conversion_rate: 0.85,
        time_last_update_unix: 1640995200,
        time_next_update_unix: 1641081600,
      };

      // First successful call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await service.getRate('USD', 'EUR');

      // Mock cache expiration by setting a past date
      const cacheStats = service.getCacheStats();
      if (cacheStats.size > 0) {
        const cachedRates = service.getCachedRates();
        // Manually expire the cache for testing
        cachedRates[0].expiresAt = new Date(Date.now() - 1000);
      }

      // Second call with API failure
      mockFetch.mockRejectedValueOnce(new Error('API error'));

      const rate = await service.getRate('USD', 'EUR');

      expect(rate).toBe(0.85); // Should return stale cached rate
    });
  });

  describe('getCachedRates', () => {
    it('should return empty array when no rates cached', () => {
      const rates = service.getCachedRates();
      expect(rates).toEqual([]);
    });

    it('should return cached rates', async () => {
      const mockResponse = {
        result: 'success',
        conversion_rate: 0.85,
        time_last_update_unix: 1640995200,
        time_next_update_unix: 1641081600,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await service.getRate('USD', 'EUR');

      const rates = service.getCachedRates();
      expect(rates).toHaveLength(1);
      expect(rates[0]).toMatchObject({
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        rate: 0.85,
      });
    });
  });

  describe('clearCache', () => {
    it('should clear all cached rates', async () => {
      const mockResponse = {
        result: 'success',
        conversion_rate: 0.85,
        time_last_update_unix: 1640995200,
        time_next_update_unix: 1641081600,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await service.getRate('USD', 'EUR');
      expect(service.getCachedRates()).toHaveLength(1);

      service.clearCache();
      expect(service.getCachedRates()).toHaveLength(0);
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', async () => {
      const stats = service.getCacheStats();
      expect(stats).toMatchObject({
        size: 0,
        oldestEntry: null,
      });

      const mockResponse = {
        result: 'success',
        conversion_rate: 0.85,
        time_last_update_unix: 1640995200,
        time_next_update_unix: 1641081600,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await service.getRate('USD', 'EUR');

      const newStats = service.getCacheStats();
      expect(newStats.size).toBe(1);
      expect(newStats.oldestEntry).toBeInstanceOf(Date);
    });
  });

  describe('fallback rates', () => {
    const fallbackTests = [
      { from: 'USD', to: 'GBP', expected: 0.79 },
      { from: 'USD', to: 'EUR', expected: 0.85 },
      { from: 'USD', to: 'CAD', expected: 1.25 },
      { from: 'USD', to: 'AUD', expected: 1.35 },
      { from: 'GBP', to: 'USD', expected: 1.27 },
      { from: 'EUR', to: 'USD', expected: 1.18 },
    ];

    fallbackTests.forEach(({ from, to, expected }) => {
      it(`should return correct fallback rate for ${from} to ${to}`, async () => {
        mockFetch.mockRejectedValueOnce(new Error('API unavailable'));

        const rate = await service.getRate(from, to);
        expect(rate).toBe(expected);
      });
    });
  });

  describe('error handling', () => {
    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const rate = await service.getRate('USD', 'EUR');
      expect(rate).toBe(0.85); // Fallback rate
    });

    it('should handle missing conversion_rate in response', async () => {
      const mockResponse = {
        result: 'success',
        // Missing conversion_rate
        time_last_update_unix: 1640995200,
        time_next_update_unix: 1641081600,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const rate = await service.getRate('USD', 'EUR');
      expect(rate).toBe(0.85); // Fallback rate
    });

    it('should handle zero conversion rate', async () => {
      const mockResponse = {
        result: 'success',
        conversion_rate: 0,
        time_last_update_unix: 1640995200,
        time_next_update_unix: 1641081600,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const rate = await service.getRate('USD', 'EUR');
      expect(rate).toBe(0.85); // Fallback rate
    });
  });
});