import { writable, derived, type Readable } from 'svelte/store';
import { browser } from '$app/environment';
import { ExchangeRateService } from '../services/exchange-rate.service';
import { DynamicPricingService } from '../services/dynamic-pricing.service';
import { TaxCalculationService } from '../services/tax-calculation.service';

// Types
interface PriceBreakdown {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
}

interface DynamicPricing {
  basePrice: number;
  currency: string;
  discountPercentage: number;
  validUntil: Date;
  region: string;
  source: 'api' | 'fallback' | 'cache';
}

interface TaxCalculation {
  rate: number;
  amount: number;
  jurisdiction: string;
  type: 'vat' | 'sales_tax' | 'gst' | 'none';
}

interface CustomerTaxInfo {
  country: string;
  region?: string;
  postalCode?: string;
  isBusinessCustomer?: boolean;
  vatNumber?: string;
  exemptionCertificate?: string;
}

interface PricingState {
  pricing: DynamicPricing | null;
  exchangeRates: Record<string, number>;
  taxCalculation: TaxCalculation | null;
  priceBreakdown: PriceBreakdown | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  customerInfo: CustomerTaxInfo | null;
}

// Environment configuration
const EXCHANGE_RATE_API_KEY = browser ? '' : process.env.EXCHANGE_RATE_API_KEY || '';
const PRICING_API_URL = browser ? '' : process.env.PRICING_API_URL || '';
const PRICING_API_KEY = browser ? '' : process.env.PRICING_API_KEY || '';

// Service instances
let exchangeRateService: ExchangeRateService;
let pricingService: DynamicPricingService;
let taxService: TaxCalculationService;

// Initialize services
function initializeServices() {
  if (!browser) {
    exchangeRateService = new ExchangeRateService(EXCHANGE_RATE_API_KEY);
    pricingService = new DynamicPricingService(PRICING_API_URL, PRICING_API_KEY);
    taxService = new TaxCalculationService();
  }
}

// Initialize services
initializeServices();

// Store state
const initialState: PricingState = {
  pricing: null,
  exchangeRates: {},
  taxCalculation: null,
  priceBreakdown: null,
  loading: false,
  error: null,
  lastUpdated: null,
  customerInfo: null
};

// Create the main store
export const pricingStore = writable<PricingState>(initialState);

// Customer info store (separate for easier updates)
export const customerInfo = writable<CustomerTaxInfo | null>(null);

// Update customer info in main store when it changes
customerInfo.subscribe(info => {
  pricingStore.update(state => ({ ...state, customerInfo: info }));
});

// Derived stores for specific data
export const currentPricing: Readable<DynamicPricing | null> = derived(
  pricingStore,
  $store => $store.pricing
);

export const priceBreakdown: Readable<PriceBreakdown | null> = derived(
  pricingStore,
  $store => $store.priceBreakdown
);

export const isLoading: Readable<boolean> = derived(
  pricingStore,
  $store => $store.loading
);

export const hasError: Readable<boolean> = derived(
  pricingStore,
  $store => !!$store.error
);

// Actions
export const pricingActions = {
  // Set customer information
  setCustomerInfo(info: CustomerTaxInfo) {
    customerInfo.set(info);
  },

  // Update customer country and trigger recalculation
  updateCustomerCountry(country: string, region?: string) {
    customerInfo.update(current => ({
      ...current,
      country,
      region,
    } as CustomerTaxInfo));
    
    // Trigger price recalculation
    this.refreshPricing();
  },

  // Get exchange rate between currencies
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    if (!browser && exchangeRateService) {
      try {
        return await exchangeRateService.getRate(fromCurrency, toCurrency);
      } catch (error) {
        console.error('Failed to get exchange rate:', error);
        return 1;
      }
    }
    return 1;
  },

  // Refresh pricing data
  async refreshPricing(region: string = 'global', product: string = 'default') {
    if (!browser) return;

    pricingStore.update(state => ({ ...state, loading: true, error: null }));

    try {
      // Get dynamic pricing
      const pricing = await pricingService.getPricing(region, product);
      
      // Get current customer info
      let currentCustomerInfo: CustomerTaxInfo | null = null;
      customerInfo.subscribe(info => currentCustomerInfo = info)();

      let taxCalculation: TaxCalculation | null = null;
      let priceBreakdown: PriceBreakdown | null = null;

      // Calculate tax if customer info is available
      if (currentCustomerInfo) {
        const finalPrice = pricingService.calculateFinalPrice(pricing);
        taxCalculation = taxService.calculateTax(finalPrice, currentCustomerInfo);
        
        priceBreakdown = {
          subtotal: pricing.basePrice,
          discount: Math.round(pricing.basePrice * (pricing.discountPercentage / 100)),
          tax: taxCalculation.amount,
          total: finalPrice + taxCalculation.amount,
          currency: pricing.currency
        };
      }

      pricingStore.update(state => ({
        ...state,
        pricing,
        taxCalculation,
        priceBreakdown,
        loading: false,
        lastUpdated: new Date()
      }));

    } catch (error) {
      console.error('Failed to refresh pricing:', error);
      pricingStore.update(state => ({
        ...state,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load pricing'
      }));
    }
  },

  // Calculate price with currency conversion
  async calculatePriceWithCurrency(
    targetCurrency: string,
    region: string = 'global',
    product: string = 'default'
  ): Promise<PriceBreakdown | null> {
    if (!browser) return null;

    try {
      const pricingWithCurrency = await pricingService.getPricingWithCurrency(
        region,
        targetCurrency,
        exchangeRateService,
        product
      );

      // Get current customer info
      let currentCustomerInfo: CustomerTaxInfo | null = null;
      customerInfo.subscribe(info => currentCustomerInfo = info)();

      if (!currentCustomerInfo) {
        return null;
      }

      const finalPrice = pricingService.calculateFinalPrice(pricingWithCurrency);
      const taxCalculation = taxService.calculateTax(finalPrice, currentCustomerInfo);

      return {
        subtotal: pricingWithCurrency.basePrice,
        discount: Math.round(pricingWithCurrency.basePrice * (pricingWithCurrency.discountPercentage / 100)),
        tax: taxCalculation.amount,
        total: finalPrice + taxCalculation.amount,
        currency: pricingWithCurrency.currency
      };

    } catch (error) {
      console.error('Failed to calculate price with currency:', error);
      return null;
    }
  },

  // Format price for display
  formatPrice(amount: number, currency: string = 'USD'): string {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount / 100);
    } catch (error) {
      // Fallback formatting
      return `${currency.toUpperCase()} ${(amount / 100).toFixed(2)}`;
    }
  },

  // Clear cache (useful for testing)
  clearCache() {
    if (!browser) {
      exchangeRateService?.clearCache();
      pricingService?.clearCache();
    }
  },

  // Get service statistics (useful for debugging)
  getServiceStats() {
    if (!browser) {
      return {
        exchangeRates: exchangeRateService?.getCacheStats(),
        pricing: pricingService?.getCacheStats(),
        taxJurisdictions: taxService?.getSupportedJurisdictions()
      };
    }
    return null;
  },

  // Reset store to initial state
  reset() {
    pricingStore.set(initialState);
    customerInfo.set(null);
  }
};

// Auto-refresh pricing periodically (every 15 minutes)
if (browser) {
  setInterval(() => {
    pricingActions.refreshPricing();
  }, 15 * 60 * 1000);
}

// Helper function to detect customer's region based on locale/IP
export function detectCustomerRegion(): CustomerTaxInfo {
  const defaultInfo: CustomerTaxInfo = {
    country: 'US',
    region: undefined,
    isBusinessCustomer: false
  };

  if (!browser) {
    return defaultInfo;
  }

  try {
    // Try to detect from browser locale
    const locale = navigator.language || 'en-US';
    const parts = locale.split('-');
    
    if (parts.length >= 2) {
      const country = parts[1].toUpperCase();
      return {
        ...defaultInfo,
        country
      };
    }
  } catch (error) {
    console.warn('Failed to detect customer region:', error);
  }

  return defaultInfo;
}

// Initialize customer info on first load
if (browser) {
  const detectedInfo = detectCustomerRegion();
  pricingActions.setCustomerInfo(detectedInfo);
  pricingActions.refreshPricing();
}