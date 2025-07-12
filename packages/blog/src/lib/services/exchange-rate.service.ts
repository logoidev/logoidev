interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: Date;
  expiresAt: Date;
}

interface ExchangeRateApiResponse {
  result: 'success' | 'error';
  conversion_rate: number;
  time_last_update_unix: number;
  time_next_update_unix: number;
  error?: string;
}

export class ExchangeRateService {
  private cache = new Map<string, ExchangeRate>();
  private readonly CACHE_DURATION = 3600000; // 1 hour
  private readonly API_TIMEOUT = 5000; // 5 seconds
  private readonly baseUrl: string;

  constructor(apiKey: string) {
    this.baseUrl = `https://v6.exchangerate-api.com/v6/${apiKey}`;
  }

  async getRate(fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const cacheKey = `${fromCurrency}-${toCurrency}`;
    const cached = this.cache.get(cacheKey);

    // Return cached rate if still valid
    if (cached && cached.expiresAt.getTime() > Date.now()) {
      return cached.rate;
    }

    try {
      const rate = await this.fetchRateFromAPI(fromCurrency, toCurrency);
      
      // Cache the new rate
      const exchangeRate: ExchangeRate = {
        fromCurrency,
        toCurrency,
        rate,
        lastUpdated: new Date(),
        expiresAt: new Date(Date.now() + this.CACHE_DURATION)
      };
      
      this.cache.set(cacheKey, exchangeRate);
      return rate;
    } catch (error) {
      console.error(`Exchange rate fetch failed for ${cacheKey}:`, error);
      
      // Try to return stale cached rate as fallback
      if (cached) {
        console.warn(`Using stale exchange rate for ${cacheKey}`);
        return cached.rate;
      }
      
      // Return hardcoded fallback rate
      return this.getFallbackRate(fromCurrency, toCurrency);
    }
  }

  private async fetchRateFromAPI(from: string, to: string): Promise<number> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT);

    try {
      const response = await fetch(`${this.baseUrl}/pair/${from}/${to}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'LogoiPaymentSystem/1.0',
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ExchangeRateApiResponse = await response.json();

      if (data.result !== 'success') {
        throw new Error(`Exchange rate API error: ${data.error || 'Unknown error'}`);
      }

      if (typeof data.conversion_rate !== 'number' || data.conversion_rate <= 0) {
        throw new Error('Invalid conversion rate received from API');
      }

      return data.conversion_rate;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private getFallbackRate(from: string, to: string): number {
    // Hardcoded fallback rates (update these periodically)
    const fallbacks: Record<string, number> = {
      'USD-GBP': 0.79,
      'USD-EUR': 0.85,
      'USD-CAD': 1.25,
      'USD-AUD': 1.35,
      'GBP-USD': 1.27,
      'EUR-USD': 1.18,
      'CAD-USD': 0.80,
      'AUD-USD': 0.74,
      'GBP-EUR': 1.15,
      'EUR-GBP': 0.87,
    };

    const key = `${from}-${to}`;
    const reverseKey = `${to}-${from}`;
    
    if (fallbacks[key]) {
      return fallbacks[key];
    }
    
    if (fallbacks[reverseKey]) {
      return 1 / fallbacks[reverseKey];
    }

    console.warn(`No fallback rate available for ${key}, using 1.0`);
    return 1.0;
  }

  // Get all cached rates (useful for debugging)
  getCachedRates(): ExchangeRate[] {
    return Array.from(this.cache.values());
  }

  // Clear cache (useful for testing or manual refresh)
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; oldestEntry: Date | null } {
    const rates = this.getCachedRates();
    const oldestEntry = rates.length > 0 
      ? rates.reduce((oldest, rate) => 
          rate.lastUpdated < oldest ? rate.lastUpdated : oldest, 
          rates[0].lastUpdated
        )
      : null;

    return {
      size: rates.length,
      oldestEntry
    };
  }
}