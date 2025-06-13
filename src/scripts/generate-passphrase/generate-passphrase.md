# Passphrase Generator

<!--
CONTEXT: This is a deterministic passphrase generator that creates fixed-length outputs from variable-length inputs.
IMPLEMENTATION: Uses cryptographic hashing with 6 configurable secret keys, inserted equidistantly into the input, to ensure consistent output length and strong security.
SECURITY: Implements a key insertion mechanism to maintain cryptographic properties while ensuring fixed output length.
-->

## Environment Configuration

The generator requires the following environment variables to be set in your `.env` file:

```env
# Required: Secret passphrase keys (recommended: 4+ character strings)
# These keys are used as cryptographic padding values and are inserted equidistantly into the input
SECRET_PASSPHRASE_KEY_1=1234
SECRET_PASSPHRASE_KEY_2=2345
SECRET_PASSPHRASE_KEY_3=3456
SECRET_PASSPHRASE_KEY_4=4567
SECRET_PASSPHRASE_KEY_5=5678
SECRET_PASSPHRASE_KEY_6=6789
```

**Best Practices:**
1. Never commit these values to version control
2. Use different values in different environments
3. Rotate these values periodically
4. Keep them secure and restrict access

## TypeScript Types

```typescript
export type PassphraseKeys = readonly [string, string, string, string, string, string];

export interface PassphraseResult {
    originalInput: string;      // Raw input string
    keys: PassphraseKeys;      // Array of 6 secret keys used
    paddedInput: string;       // Input with keys inserted equidistantly
    inputLength: number;       // Length of padded input
    passphrase: string;        // Fixed-length hex output (48 chars)
    base64Passphrase: string;  // Fixed-length base64 output (48 chars)
    hash: string;              // Full cryptographic hash (64 hex chars)
}
```

## Core Constants

```typescript
// Input constraints
MIN_INPUT_LENGTH = 4
MAX_INPUT_LENGTH = 1024  // 1KB limit (including padding)

// Output configuration
OUTPUT_LENGTH = 48  // Fixed length for both hex and base64 outputs
```

## Input Processing

<!--
ALGORITHM: 
1. Validate input
2. Split input into 6 segments
3. Insert each key before each segment
4. Concatenate to form padded input
5. Generate cryptographic hash
6. Derive fixed-length outputs
-->

### Input Requirements
- Type: `string`
- Length: `[MIN_INPUT_LENGTH, MAX_INPUT_LENGTH_WITH_PADDING]` (input + all key lengths ≤ 1024)
- Validation: Throws descriptive errors for invalid inputs

### Security Features
- 6 configurable secret keys (recommended: unique, random, and secret)
- Deterministic output for same input + same keys
- Cryptographic hash generation (SHA-256)
- Fixed-length output guarantee
- Full hash preservation for verification
- No secrets are stored or logged

## Usage Examples

### Basic Usage
```typescript
import { generatePassphrase } from './generate-passphrase.js';

// Prepare keys (from environment or direct input)
const keys = [
  process.env.SECRET_PASSPHRASE_KEY_1!,
  process.env.SECRET_PASSPHRASE_KEY_2!,
  process.env.SECRET_PASSPHRASE_KEY_3!,
  process.env.SECRET_PASSPHRASE_KEY_4!,
  process.env.SECRET_PASSPHRASE_KEY_5!,
  process.env.SECRET_PASSPHRASE_KEY_6!
] as const;

const result = generatePassphrase('input string', keys);

// Access outputs
console.log(result.passphrase);        // Fixed-length hex (48 chars)
console.log(result.base64Passphrase);  // Fixed-length base64 (48 chars)
console.log(result.hash);              // Full hash (64 hex chars)
```

### CLI Usage
The generator can be used from the command line:

```bash
# Basic usage (uses environment variables)
node generate-passphrase.js "your input string"

# Output will show:
# - Original input
# - Used keys
# - Padded input
# - Input length
# - Hex version (48 chars)
# - Base64 version (48 chars)
# - Full SHA-256 hash
```

## Error Cases

<!--
ERROR_HANDLING: All errors are thrown with descriptive messages
VALIDATION: Input validation happens before any processing
-->

```typescript
// Type validation
if (typeof input !== 'string') {
    throw new Error('Input must be a string');
}

// Length validation
if (input.length < MIN_INPUT_LENGTH) {
    throw new Error(`Input length must be at least ${MIN_INPUT_LENGTH} characters`);
}
if (input.length > MAX_INPUT_LENGTH_WITH_PADDING) {
    throw new Error(`Input length plus padding exceeds maximum allowed length of ${MAX_INPUT_LENGTH_WITH_PADDING} characters`);
}
```

## Security Recommendations

<!--
CRITICAL_POINTS:
1. Always use custom, unique keys
2. Keep keys secure
3. Validate all inputs
4. Use the full hash for verification when needed
-->

1. **Environment Configuration**
   - Store passphrase keys in environment variables
   - Use different values for different environments
   - Rotate values periodically
   - Never commit `.env` files to version control
   - Use secure secret management in production

2. **Key Configuration**
   - Use unique, secure key values
   - Change default key values
   - Keep keys confidential
   - Consider using a secret management service

3. **Input Handling**
   - Validate all inputs before processing
   - Sanitize input strings
   - Monitor for unusual input patterns

4. **Output Usage**
   - Use the full hash for critical verifications
   - Consider the fixed-length outputs as derived values
   - Implement additional security measures as needed

## Implementation Notes

1. **Input Processing**
   - Validation occurs first
   - Input is split into 6 segments
   - Each key is inserted before each segment (equidistant insertion)
   - Segments are concatenated with keys to form the padded input
   - Cryptographic hash is generated from the padded input

2. **Output Generation**
   - Primary cryptographic hash (SHA-256)
   - Derived output formats: 48-char hex, 48-char base64
   - Secure length correction (padding if necessary)

3. **Security Considerations**
   - Key insertion mechanism is deterministic and secure
   - Full hash is preserved
   - Custom configuration allows for output variation

4. **Key Insertion Mechanism**
   - Input is split into 6 segments
   - Each key is inserted before each segment
   - Padded input: key1+part1+key2+part2+...+key6+part6
   - Ensures keys are distributed throughout the input
   - Maximizes entropy and resistance to attacks

5. **Internal Components**
   - No secrets are stored or logged
   - All sensitive values are configurable
   - Designed for both CLI and programmatic use 