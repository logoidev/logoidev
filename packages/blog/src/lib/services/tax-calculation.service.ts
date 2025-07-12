interface TaxCalculation {
  rate: number; // percentage
  amount: number; // in cents
  jurisdiction: string;
  type: 'vat' | 'sales_tax' | 'gst' | 'none';
}

interface TaxRule {
  jurisdiction: string;
  type: 'vat' | 'sales_tax' | 'gst' | 'none';
  rate: number; // percentage
  threshold?: number; // minimum amount in cents for tax to apply
  exemptions?: string[]; // product types that are exempt
}

interface CustomerTaxInfo {
  country: string;
  region?: string; // state/province for US/CA
  postalCode?: string;
  isBusinessCustomer?: boolean;
  vatNumber?: string;
  exemptionCertificate?: string;
}

export class TaxCalculationService {
  private taxRules: Map<string, TaxRule> = new Map();
  private readonly CACHE_DURATION = 86400000; // 24 hours
  private lastRulesUpdate = 0;

  constructor() {
    this.initializeDefaultTaxRules();
  }

  private initializeDefaultTaxRules(): void {
    const defaultRules: TaxRule[] = [
      // United States - varies by state, using average
      { jurisdiction: 'US', type: 'sales_tax', rate: 8.5, threshold: 0 },
      { jurisdiction: 'US-CA', type: 'sales_tax', rate: 10.5, threshold: 0 }, // California
      { jurisdiction: 'US-NY', type: 'sales_tax', rate: 8.0, threshold: 0 }, // New York
      { jurisdiction: 'US-TX', type: 'sales_tax', rate: 6.25, threshold: 0 }, // Texas
      { jurisdiction: 'US-FL', type: 'sales_tax', rate: 6.0, threshold: 0 }, // Florida
      
      // United Kingdom
      { jurisdiction: 'GB', type: 'vat', rate: 20.0, threshold: 0 },
      
      // European Union (common VAT rates)
      { jurisdiction: 'DE', type: 'vat', rate: 19.0, threshold: 0 }, // Germany
      { jurisdiction: 'FR', type: 'vat', rate: 20.0, threshold: 0 }, // France
      { jurisdiction: 'IT', type: 'vat', rate: 22.0, threshold: 0 }, // Italy
      { jurisdiction: 'ES', type: 'vat', rate: 21.0, threshold: 0 }, // Spain
      { jurisdiction: 'NL', type: 'vat', rate: 21.0, threshold: 0 }, // Netherlands
      
      // Canada
      { jurisdiction: 'CA', type: 'gst', rate: 5.0, threshold: 0 }, // Federal GST
      { jurisdiction: 'CA-ON', type: 'gst', rate: 13.0, threshold: 0 }, // Ontario HST
      { jurisdiction: 'CA-QC', type: 'gst', rate: 14.975, threshold: 0 }, // Quebec GST+QST
      { jurisdiction: 'CA-BC', type: 'gst', rate: 12.0, threshold: 0 }, // British Columbia
      
      // Australia
      { jurisdiction: 'AU', type: 'gst', rate: 10.0, threshold: 0 },
      
      // No tax jurisdictions
      { jurisdiction: 'DEFAULT', type: 'none', rate: 0, threshold: 0 }
    ];

    defaultRules.forEach(rule => {
      this.taxRules.set(rule.jurisdiction, rule);
    });

    this.lastRulesUpdate = Date.now();
  }

  calculateTax(
    amount: number, // in cents
    customerInfo: CustomerTaxInfo,
    productType: string = 'digital_service'
  ): TaxCalculation {
    try {
      const taxRule = this.getTaxRule(customerInfo);
      
      // Check if customer is exempt
      if (this.isCustomerExempt(customerInfo, taxRule)) {
        return {
          rate: 0,
          amount: 0,
          jurisdiction: taxRule.jurisdiction,
          type: 'none'
        };
      }

      // Check if product is exempt
      if (this.isProductExempt(productType, taxRule)) {
        return {
          rate: 0,
          amount: 0,
          jurisdiction: taxRule.jurisdiction,
          type: 'none'
        };
      }

      // Check threshold
      if (taxRule.threshold && amount < taxRule.threshold) {
        return {
          rate: 0,
          amount: 0,
          jurisdiction: taxRule.jurisdiction,
          type: 'none'
        };
      }

      // Calculate tax amount
      const taxAmount = Math.round(amount * (taxRule.rate / 100));

      return {
        rate: taxRule.rate,
        amount: taxAmount,
        jurisdiction: taxRule.jurisdiction,
        type: taxRule.type
      };
    } catch (error) {
      console.error('Tax calculation failed:', error);
      
      // Return no tax as fallback
      return {
        rate: 0,
        amount: 0,
        jurisdiction: 'UNKNOWN',
        type: 'none'
      };
    }
  }

  private getTaxRule(customerInfo: CustomerTaxInfo): TaxRule {
    // Try to get specific state/province rule first
    if (customerInfo.region) {
      const specificJurisdiction = `${customerInfo.country}-${customerInfo.region}`;
      const specificRule = this.taxRules.get(specificJurisdiction);
      if (specificRule) {
        return specificRule;
      }
    }

    // Try to get country rule
    const countryRule = this.taxRules.get(customerInfo.country);
    if (countryRule) {
      return countryRule;
    }

    // Fallback to default (no tax)
    return this.taxRules.get('DEFAULT')!;
  }

  private isCustomerExempt(customerInfo: CustomerTaxInfo, taxRule: TaxRule): boolean {
    // Business customers with valid VAT number (EU)
    if (customerInfo.isBusinessCustomer && 
        customerInfo.vatNumber && 
        taxRule.type === 'vat' &&
        this.isValidVATNumber(customerInfo.vatNumber)) {
      return true;
    }

    // Customers with exemption certificate
    if (customerInfo.exemptionCertificate) {
      return true;
    }

    return false;
  }

  private isProductExempt(productType: string, taxRule: TaxRule): boolean {
    if (!taxRule.exemptions) {
      return false;
    }

    return taxRule.exemptions.includes(productType);
  }

  private isValidVATNumber(vatNumber: string): boolean {
    // Basic VAT number validation (simplified)
    // In production, you'd want to use a proper VAT validation service
    const vatRegex = /^[A-Z]{2}[0-9A-Z]{8,12}$/;
    return vatRegex.test(vatNumber.replace(/\s/g, '').toUpperCase());
  }

  // Calculate total amount including tax
  calculateTotalWithTax(
    amount: number,
    customerInfo: CustomerTaxInfo,
    productType?: string
  ): { subtotal: number; tax: TaxCalculation; total: number } {
    const taxCalculation = this.calculateTax(amount, customerInfo, productType);
    
    return {
      subtotal: amount,
      tax: taxCalculation,
      total: amount + taxCalculation.amount
    };
  }

  // Update tax rules from external source
  async updateTaxRules(rulesUrl?: string): Promise<void> {
    try {
      if (rulesUrl) {
        const response = await fetch(rulesUrl, {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const rules: TaxRule[] = await response.json();
          this.loadTaxRules(rules);
        }
      }
      
      this.lastRulesUpdate = Date.now();
    } catch (error) {
      console.error('Failed to update tax rules:', error);
      // Continue with existing rules
    }
  }

  private loadTaxRules(rules: TaxRule[]): void {
    // Validate and load new rules
    rules.forEach(rule => {
      if (this.validateTaxRule(rule)) {
        this.taxRules.set(rule.jurisdiction, rule);
      }
    });
  }

  private validateTaxRule(rule: TaxRule): boolean {
    return (
      typeof rule.jurisdiction === 'string' &&
      typeof rule.rate === 'number' &&
      rule.rate >= 0 &&
      rule.rate <= 100 &&
      ['vat', 'sales_tax', 'gst', 'none'].includes(rule.type)
    );
  }

  // Get tax rule for jurisdiction (useful for debugging)
  getTaxRuleForJurisdiction(jurisdiction: string): TaxRule | undefined {
    return this.taxRules.get(jurisdiction);
  }

  // Get all supported jurisdictions
  getSupportedJurisdictions(): string[] {
    return Array.from(this.taxRules.keys());
  }

  // Check if tax rules need updating
  needsRulesUpdate(): boolean {
    return Date.now() - this.lastRulesUpdate > this.CACHE_DURATION;
  }
}