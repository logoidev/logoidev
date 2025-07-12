import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaxCalculationService } from './tax-calculation.service';

describe('TaxCalculationService', () => {
  let service: TaxCalculationService;

  beforeEach(() => {
    service = new TaxCalculationService();
  });

  describe('calculateTax', () => {
    it('should calculate US sales tax', () => {
      const customerInfo = {
        country: 'US',
        region: 'CA',
        postalCode: '90210',
        isBusinessCustomer: false,
      };

      const tax = service.calculateTax(1000, customerInfo);

      expect(tax).toMatchObject({
        rate: 8.75,
        amount: 88, // 1000 * 0.0875 = 87.5, rounded to 88
        jurisdiction: 'US-CA',
        type: 'sales_tax',
      });
    });

    it('should calculate EU VAT', () => {
      const customerInfo = {
        country: 'DE',
        postalCode: '10115',
        isBusinessCustomer: false,
      };

      const tax = service.calculateTax(1000, customerInfo);

      expect(tax).toMatchObject({
        rate: 19,
        amount: 190, // 1000 * 0.19 = 190
        jurisdiction: 'EU-DE',
        type: 'vat',
      });
    });

    it('should calculate Canadian GST', () => {
      const customerInfo = {
        country: 'CA',
        region: 'ON',
        postalCode: 'M5H 2N2',
        isBusinessCustomer: false,
      };

      const tax = service.calculateTax(1000, customerInfo);

      expect(tax).toMatchObject({
        rate: 13,
        amount: 130, // 1000 * 0.13 = 130
        jurisdiction: 'CA-ON',
        type: 'gst',
      });
    });

    it('should handle no tax jurisdiction', () => {
      const customerInfo = {
        country: 'XX', // Unknown country
        isBusinessCustomer: false,
      };

      const tax = service.calculateTax(1000, customerInfo);

      expect(tax).toMatchObject({
        rate: 0,
        amount: 0,
        jurisdiction: 'XX',
        type: 'none',
      });
    });

    it('should handle business customer with valid VAT number', () => {
      const customerInfo = {
        country: 'DE',
        postalCode: '10115',
        isBusinessCustomer: true,
        vatNumber: 'DE123456789',
      };

      const tax = service.calculateTax(1000, customerInfo);

      expect(tax).toMatchObject({
        rate: 0,
        amount: 0,
        jurisdiction: 'EU-DE',
        type: 'vat',
      });
    });

    it('should charge VAT to business customer without valid VAT number', () => {
      const customerInfo = {
        country: 'DE',
        postalCode: '10115',
        isBusinessCustomer: true,
        // No VAT number provided
      };

      const tax = service.calculateTax(1000, customerInfo);

      expect(tax).toMatchObject({
        rate: 19,
        amount: 190,
        jurisdiction: 'EU-DE',
        type: 'vat',
      });
    });

    it('should handle tax threshold minimum', () => {
      const customerInfo = {
        country: 'AU',
        isBusinessCustomer: false,
      };

      // Test below threshold (assuming AUD 10 threshold)
      const tax = service.calculateTax(50, customerInfo);

      expect(tax).toMatchObject({
        rate: 0,
        amount: 0,
        jurisdiction: 'AU',
        type: 'gst',
      });
    });

    it('should handle tax above threshold', () => {
      const customerInfo = {
        country: 'AU',
        isBusinessCustomer: false,
      };

      // Test above threshold
      const tax = service.calculateTax(1000, customerInfo);

      expect(tax).toMatchObject({
        rate: 10,
        amount: 100,
        jurisdiction: 'AU',
        type: 'gst',
      });
    });

    it('should handle zero amount', () => {
      const customerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      const tax = service.calculateTax(0, customerInfo);

      expect(tax).toMatchObject({
        rate: 8.75,
        amount: 0,
        jurisdiction: 'US-CA',
        type: 'sales_tax',
      });
    });

    it('should handle negative amount', () => {
      const customerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      const tax = service.calculateTax(-1000, customerInfo);

      expect(tax).toMatchObject({
        rate: 8.75,
        amount: 0, // Should not return negative tax
        jurisdiction: 'US-CA',
        type: 'sales_tax',
      });
    });

    it('should round tax amount to nearest cent', () => {
      const customerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      const tax = service.calculateTax(333, customerInfo); // 333 * 0.0875 = 29.1375

      expect(tax.amount).toBe(29); // Should round to 29
    });
  });

  describe('getJurisdictionTaxRate', () => {
    it('should return correct tax rate for various jurisdictions', () => {
      const testCases = [
        { country: 'US', region: 'CA', expected: 8.75 },
        { country: 'US', region: 'NY', expected: 8.0 },
        { country: 'US', region: 'TX', expected: 6.25 },
        { country: 'DE', expected: 19 },
        { country: 'GB', expected: 20 },
        { country: 'FR', expected: 20 },
        { country: 'CA', region: 'ON', expected: 13 },
        { country: 'CA', region: 'BC', expected: 12 },
        { country: 'AU', expected: 10 },
        { country: 'XX', expected: 0 }, // Unknown country
      ];

      testCases.forEach(({ country, region, expected }) => {
        const rate = service.getJurisdictionTaxRate(country, region);
        expect(rate).toBe(expected);
      });
    });

    it('should handle case insensitive country codes', () => {
      const rate1 = service.getJurisdictionTaxRate('us', 'ca');
      const rate2 = service.getJurisdictionTaxRate('US', 'CA');
      expect(rate1).toBe(rate2);
    });

    it('should handle undefined region', () => {
      const rate = service.getJurisdictionTaxRate('US', undefined);
      expect(rate).toBe(0); // Should return 0 for unknown region
    });
  });

  describe('validateVatNumber', () => {
    it('should validate EU VAT numbers', () => {
      const validNumbers = [
        'DE123456789',
        'FR12345678901',
        'GB999999999',
        'NL123456789B01',
        'ES12345678Z',
      ];

      validNumbers.forEach(vatNumber => {
        expect(service.validateVatNumber(vatNumber)).toBe(true);
      });
    });

    it('should reject invalid VAT numbers', () => {
      const invalidNumbers = [
        'DE12345678', // Too short
        'XX123456789', // Invalid country code
        'DE12345678901', // Too long for DE
        'INVALID',
        '',
        '123456789',
      ];

      invalidNumbers.forEach(vatNumber => {
        expect(service.validateVatNumber(vatNumber)).toBe(false);
      });
    });

    it('should handle case insensitive VAT numbers', () => {
      const result1 = service.validateVatNumber('de123456789');
      const result2 = service.validateVatNumber('DE123456789');
      expect(result1).toBe(result2);
    });

    it('should handle undefined VAT number', () => {
      expect(service.validateVatNumber(undefined)).toBe(false);
    });
  });

  describe('calculateTaxWithExemptions', () => {
    it('should apply exemptions for digital services', () => {
      const customerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
        exemptionCertificate: 'DIGITAL_SERVICE_EXEMPT',
      };

      const tax = service.calculateTaxWithExemptions(
        1000,
        customerInfo,
        'digital_service',
        ['digital_service']
      );

      expect(tax).toMatchObject({
        rate: 0,
        amount: 0,
        jurisdiction: 'US-CA',
        type: 'sales_tax',
      });
    });

    it('should charge tax when no exemptions apply', () => {
      const customerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      const tax = service.calculateTaxWithExemptions(
        1000,
        customerInfo,
        'physical_product',
        ['digital_service'] // Exemption doesn't apply
      );

      expect(tax).toMatchObject({
        rate: 8.75,
        amount: 88,
        jurisdiction: 'US-CA',
        type: 'sales_tax',
      });
    });

    it('should handle multiple exemptions', () => {
      const customerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
        exemptionCertificate: 'EDUCATIONAL_EXEMPT',
      };

      const tax = service.calculateTaxWithExemptions(
        1000,
        customerInfo,
        'educational_material',
        ['digital_service', 'educational_material']
      );

      expect(tax).toMatchObject({
        rate: 0,
        amount: 0,
        jurisdiction: 'US-CA',
        type: 'sales_tax',
      });
    });
  });

  describe('getTaxSummary', () => {
    it('should return tax summary for multiple line items', () => {
      const lineItems = [
        { amount: 1000, productType: 'digital_service' },
        { amount: 2000, productType: 'physical_product' },
        { amount: 500, productType: 'subscription' },
      ];

      const customerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      const summary = service.getTaxSummary(lineItems, customerInfo);

      expect(summary).toMatchObject({
        totalTaxableAmount: 3500,
        totalTaxAmount: 306, // 3500 * 0.0875 = 306.25, rounded to 306
        averageRate: 8.75,
        jurisdiction: 'US-CA',
        type: 'sales_tax',
        breakdown: expect.any(Array),
      });

      expect(summary.breakdown).toHaveLength(3);
      expect(summary.breakdown[0]).toMatchObject({
        amount: 1000,
        taxAmount: 88,
        productType: 'digital_service',
      });
    });

    it('should handle empty line items', () => {
      const customerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      const summary = service.getTaxSummary([], customerInfo);

      expect(summary).toMatchObject({
        totalTaxableAmount: 0,
        totalTaxAmount: 0,
        averageRate: 0,
        jurisdiction: 'US-CA',
        type: 'sales_tax',
        breakdown: [],
      });
    });

    it('should handle mixed tax rates with exemptions', () => {
      const lineItems = [
        { amount: 1000, productType: 'digital_service' },
        { amount: 2000, productType: 'physical_product' },
      ];

      const customerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
        exemptionCertificate: 'DIGITAL_SERVICE_EXEMPT',
      };

      const summary = service.getTaxSummaryWithExemptions(
        lineItems,
        customerInfo,
        ['digital_service'] // Only digital services are exempt
      );

      expect(summary).toMatchObject({
        totalTaxableAmount: 2000, // Only physical product taxable
        totalTaxAmount: 175, // 2000 * 0.0875 = 175
        averageRate: 8.75,
        jurisdiction: 'US-CA',
        type: 'sales_tax',
      });

      expect(summary.breakdown).toHaveLength(2);
      expect(summary.breakdown[0].taxAmount).toBe(0); // Digital service exempt
      expect(summary.breakdown[1].taxAmount).toBe(175); // Physical product taxed
    });
  });

  describe('error handling', () => {
    it('should handle invalid customer info', () => {
      const invalidCustomerInfo = {
        country: '',
        isBusinessCustomer: false,
      };

      const tax = service.calculateTax(1000, invalidCustomerInfo);

      expect(tax).toMatchObject({
        rate: 0,
        amount: 0,
        jurisdiction: '',
        type: 'none',
      });
    });

    it('should handle null customer info', () => {
      const tax = service.calculateTax(1000, null as any);

      expect(tax).toMatchObject({
        rate: 0,
        amount: 0,
        jurisdiction: 'unknown',
        type: 'none',
      });
    });

    it('should handle very large amounts', () => {
      const customerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      const tax = service.calculateTax(Number.MAX_SAFE_INTEGER, customerInfo);

      expect(tax.amount).toBeGreaterThan(0);
      expect(tax.amount).toBeLessThan(Number.MAX_SAFE_INTEGER);
    });

    it('should handle floating point precision', () => {
      const customerInfo = {
        country: 'US',
        region: 'CA',
        isBusinessCustomer: false,
      };

      const tax = service.calculateTax(123.45, customerInfo);

      expect(tax.amount).toBe(11); // 123.45 * 0.0875 = 10.80... rounded to 11
    });
  });

  describe('updateTaxRules', () => {
    it('should update tax rules for jurisdiction', () => {
      const newRule = {
        jurisdiction: 'US-WA',
        type: 'sales_tax' as const,
        rate: 10.4,
        threshold: 0,
      };

      service.updateTaxRule(newRule);

      const customerInfo = {
        country: 'US',
        region: 'WA',
        isBusinessCustomer: false,
      };

      const tax = service.calculateTax(1000, customerInfo);

      expect(tax).toMatchObject({
        rate: 10.4,
        amount: 104,
        jurisdiction: 'US-WA',
        type: 'sales_tax',
      });
    });

    it('should handle batch tax rule updates', () => {
      const newRules = [
        {
          jurisdiction: 'US-FL',
          type: 'sales_tax' as const,
          rate: 6.0,
          threshold: 0,
        },
        {
          jurisdiction: 'US-OR',
          type: 'sales_tax' as const,
          rate: 0, // No sales tax in Oregon
          threshold: 0,
        },
      ];

      service.updateTaxRules(newRules);

      // Test Florida
      const flTax = service.calculateTax(1000, {
        country: 'US',
        region: 'FL',
        isBusinessCustomer: false,
      });

      expect(flTax.rate).toBe(6.0);

      // Test Oregon
      const orTax = service.calculateTax(1000, {
        country: 'US',
        region: 'OR',
        isBusinessCustomer: false,
      });

      expect(orTax.rate).toBe(0);
    });
  });
});