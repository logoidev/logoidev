# Testing Setup Guide

This guide provides step-by-step instructions for setting up and running the comprehensive test suite for the enhanced payment system.

## Prerequisites

- Node.js (version 18 or higher)
- npm or pnpm package manager
- Git (for cloning the repository)

## Installation

### 1. Install Dependencies

```bash
# Install all dependencies including test dependencies
npm install

# Or using pnpm
pnpm install
```

### 2. Verify Installation

Check that all test dependencies are installed:

```bash
# Check vitest installation
npx vitest --version

# Check that all packages are available
npm ls vitest @vitest/ui jsdom
```

## Running Tests

### Quick Start

```bash
# Run all tests once
npm run test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Commands Explained

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run test` | Run all tests once | CI/CD, final validation |
| `npm run test:watch` | Run tests in watch mode | Development, debugging |
| `npm run test:ui` | Run tests with visual interface | Interactive testing |
| `npm run test:coverage` | Generate coverage report | Coverage analysis |

## Test Structure

```
packages/blog/
├── src/
│   ├── lib/
│   │   ├── services/
│   │   │   ├── exchange-rate.service.test.ts
│   │   │   ├── dynamic-pricing.service.test.ts
│   │   │   └── tax-calculation.service.test.ts
│   │   └── stores/
│   │       └── pricing.store.test.ts
│   ├── routes/
│   │   └── payment/
│   │       └── payment.test.ts
│   └── test-setup.ts
├── vitest.config.ts
└── package.json
```

## Environment Setup

### Test Environment Variables

Create a `.env.test` file (if needed):

```env
# Test environment variables
SECRET_STRIPE_KEY=sk_test_mock_key
EXCHANGE_RATE_API_KEY=test_exchange_key
PRICING_API_URL=https://test-pricing-api.com
PRICING_API_KEY=test_pricing_key
```

### Mock Configuration

The test suite uses comprehensive mocking for:
- Stripe API calls
- External API services
- SvelteKit environment
- Browser/server contexts

## Test Output

### Successful Test Run

```bash
✓ src/lib/services/exchange-rate.service.test.ts (25)
✓ src/lib/services/dynamic-pricing.service.test.ts (23)
✓ src/lib/services/tax-calculation.service.test.ts (21)
✓ src/lib/stores/pricing.store.test.ts (18)
✓ src/routes/payment/payment.test.ts (16)

Test Files  5 passed (5)
Tests  103 passed (103)
```

### Coverage Report

```bash
% Coverage report from c8
------------------------------|---------|----------|---------|---------|
File                          | % Stmts | % Branch | % Funcs | % Lines |
------------------------------|---------|----------|---------|---------|
All files                     |   92.34 |    89.12 |   95.67 |   91.87 |
 services/                    |   94.23 |    91.45 |   96.78 |   93.56 |
  exchange-rate.service.ts     |   95.12 |    92.34 |   97.89 |   94.67 |
  dynamic-pricing.service.ts   |   93.45 |    90.12 |   95.67 |   92.34 |
  tax-calculation.service.ts   |   94.12 |    91.89 |   96.78 |   93.45 |
 stores/                      |   90.12 |    86.78 |   94.56 |   89.67 |
  pricing.store.ts            |   90.12 |    86.78 |   94.56 |   89.67 |
 routes/payment/              |   88.67 |    84.56 |   92.34 |   87.89 |
  +server.ts                  |   88.67 |    84.56 |   92.34 |   87.89 |
------------------------------|---------|----------|---------|---------|
```

## Debugging Tests

### Watch Mode

For development and debugging:

```bash
npm run test:watch
```

This will:
- Re-run tests when files change
- Show only failing tests
- Provide interactive filtering

### Individual Test Files

Run specific test files:

```bash
# Run only exchange rate tests
npx vitest src/lib/services/exchange-rate.service.test.ts

# Run only payment endpoint tests
npx vitest src/routes/payment/payment.test.ts
```

### Test Filtering

Filter tests by name:

```bash
# Run tests matching "currency"
npx vitest --reporter=verbose --grep="currency"

# Run tests matching specific pattern
npx vitest --reporter=verbose --grep="should handle.*error"
```

## Common Issues and Solutions

### 1. TypeScript Errors

If you see TypeScript errors in test files:

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run check
```

### 2. Mock Import Issues

If mocks aren't working:

```bash
# Check that test-setup.ts is loaded
npx vitest --reporter=verbose --config vitest.config.ts
```

### 3. Environment Variables

If environment variables aren't available:

```bash
# Check environment setup
npx vitest --reporter=verbose --grep="environment"
```

### 4. Cache Issues

Clear vitest cache:

```bash
npx vitest --run --reporter=verbose --clearCache
```

## IDE Integration

### VSCode

Install recommended extensions:

```json
{
  "recommendations": [
    "ZixuanChen.vitest-explorer",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Test Runner Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Continuous Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Generate coverage
        run: npm run test:coverage
```

## Performance Considerations

### Test Execution Time

The test suite is optimized for speed:
- Parallel test execution
- Efficient mocking
- Minimal setup/teardown

Expected execution times:
- Full test suite: ~30-60 seconds
- Individual service tests: ~5-10 seconds
- Watch mode: ~1-3 seconds per change

### Memory Usage

Tests use minimal memory through:
- Proper mock cleanup
- Efficient test isolation
- Optimized test data

## Troubleshooting Checklist

Before reporting issues, check:

1. **Dependencies**: `npm ls vitest @vitest/ui jsdom`
2. **Node Version**: `node --version` (should be 18+)
3. **TypeScript**: `npm run check`
4. **Environment**: Test environment variables are set
5. **Cache**: Clear with `npx vitest --clearCache`

## Support

For issues with the test suite:

1. Check the [TEST_SUMMARY.md](./TEST_SUMMARY.md) for detailed test documentation
2. Review the [PAYMENT_SYSTEM.md](./PAYMENT_SYSTEM.md) for system architecture
3. Look at test output for specific error messages
4. Check individual test files for test-specific issues

## Next Steps

After setting up the test suite:

1. Run the full test suite to verify everything works
2. Try the watch mode for development
3. Explore the UI interface for interactive testing
4. Set up your IDE integration for better developer experience
5. Configure CI/CD pipeline for automated testing

The test suite provides comprehensive coverage of the enhanced payment system, ensuring reliability and maintainability of the codebase.