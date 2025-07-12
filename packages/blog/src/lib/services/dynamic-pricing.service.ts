interface DynamicPricing {
  basePrice: number; // in cents
  currency: string;
  discountPercentage: number;
  validUntil: Date;
  region: string;
  source: 'api' | 'fallback' | 'cache';
}

interface PricingApiResponse {
  basePrice: number;
  currency: string;
  discountPercentage: number;
  validUntil: string; // ISO date string
  region: string;
  metadata?: Record<string, any>;
}

export class DynamicPricingService {
  private cache = new Map<string, DynamicPricing>();
  private readonly CACHE_DURATION = 900000; // 15 minutes
  private readonly API_TIMEOUT = 3000; // 3 seconds
  private readonly fallbackPricing: DynamicPricing;

  constructor(private apiUrl: string, private apiKey: string) {
    // Default fallback pricing
    this.fallbackPricing = {
      basePrice: 100, // $1.00
      currency: 'USD',
      discountPercentage: 0,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      region: 'global',
      source: 'fallback'
    };
  }

  async getPricing(region: string = 'global', product: string = 'default'): Promise<DynamicPricing> {
    const cacheKey = `${region}-${product}`;
    const cached = this.cache.get(cacheKey);

    // Return cached pricing if still valid
    if (cached && cached.validUntil.getTime() > Date.now()) {
      return cached;
    }

    try {
      const pricing = await this.fetchPricingFromAPI(region, product);
      
      // Cache the new pricing
      this.cache.set(cacheKey, pricing);
      return pricing;
    } catch (error) {
      console.error(`Dynamic pricing fetch failed for ${cacheKey}:`, error);
      
      // Try to return stale cached pricing as fallback
      if (cached) {
        console.warn(`Using stale pricing for ${cacheKey}`);
        return { ...cached, source: 'cache' as const };
      }
      
      // Return fallback pricing
      console.warn(`Using fallback pricing for ${cacheKey}`);
      return { ...this.fallbackPricing, region };
    }
  }

  private async fetchPricingFromAPI(region: string, product: string): Promise<DynamicPricing> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT);

    try {
      const url = new URL(this.apiUrl);
      url.searchParams.set('region', region);
      url.searchParams.set('product', product);

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'LogoiPaymentSystem/1.0'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: PricingApiResponse = await response.json();

      // Validate the response
      this.validatePricingResponse(data);

      return {
        basePrice: Math.round(data.basePrice),
        currency: data.currency.toUpperCase(),
        discountPercentage: Math.max(0, Math.min(100, data.discountPercentage)),
        validUntil: new Date(data.validUntil),
        region: data.region || region,
        source: 'api'
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private validatePricingResponse(data: PricingApiResponse): void {
    if (typeof data.basePrice !== 'number' || data.basePrice < 0) {
      throw new Error('Invalid base price in pricing response');
    }

    if (typeof data.currency !== 'string' || data.currency.length !== 3) {
      throw new Error('Invalid currency in pricing response');
    }

    if (typeof data.discountPercentage !== 'number' || 
        data.discountPercentage < 0 || data.discountPercentage > 100) {
      throw new Error('Invalid discount percentage in pricing response');
    }

    const validUntil = new Date(data.validUntil);
    if (isNaN(validUntil.getTime()) || validUntil.getTime() <= Date.now()) {
      throw new Error('Invalid or expired validUntil date in pricing response');
    }
  }

  // Calculate final price with discount applied
  calculateFinalPrice(pricing: DynamicPricing): number {
    const discountAmount = Math.round(pricing.basePrice * (pricing.discountPercentage / 100));
    return Math.max(0, pricing.basePrice - discountAmount);
  }

  // Get pricing with currency conversion
  async getPricingWithCurrency(
    region: string,
    targetCurrency: string,
    exchangeRateService: { getRate: (from: string, to: string) => Promise<number> },
    product: string = 'default'
  ): Promise<DynamicPricing> {
    const basePricing = await this.getPricing(region, product);
    
    if (basePricing.currency === targetCurrency) {
      return basePricing;
    }

    try {
      const exchangeRate = await exchangeRateService.getRate(basePricing.currency, targetCurrency);
      const convertedPrice = Math.round(basePricing.basePrice * exchangeRate);

      return {
        ...basePricing,
        basePrice: convertedPrice,
        currency: targetCurrency
      };
    } catch (error) {
      console.error('Currency conversion failed, returning original pricing:', error);
      return basePricing;
    }
  }

  // Clear cache (useful for testing or manual refresh)
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; entries: Array<{ key: string; validUntil: Date; source: string }> } {
    const entries = Array.from(this.cache.entries()).map(([key, pricing]) => ({
      key,
      validUntil: pricing.validUntil,
      source: pricing.source
    }));

    return {
      size: this.cache.size,
      entries
    };
  }

  // Update fallback pricing (useful for configuration updates)
  updateFallbackPricing(pricing: Partial<DynamicPricing>): void {
    Object.assign(this.fallbackPricing, pricing);
  }
}