#!/usr/bin/env node
/**
 * Validates Clear-style speaker overlay JSON and prints a summary.
 * Usage: node scripts/import-clear-speakers.mjs path/to/overlay.json
 */

import fs from 'node:fs/promises';
import process from 'node:process';

function validateOverlay(bundle) {
  if (!bundle.translationId || !bundle.bookId) {
    throw new Error('Overlay must include translationId and bookId');
  }

  if (!Array.isArray(bundle.spans)) {
    throw new Error('Overlay must include spans array');
  }

  for (const span of bundle.spans) {
    if (typeof span.confidence !== 'number' || span.confidence < 0 || span.confidence > 1) {
      throw new Error(`Invalid confidence on span ${JSON.stringify(span)}`);
    }

    if (!span.speakerGroup || !['christ', 'prophet', 'other'].includes(span.speakerGroup)) {
      throw new Error(`Invalid speakerGroup on span ${JSON.stringify(span)}`);
    }

    if (!span.source) {
      throw new Error(`Missing source on span ${JSON.stringify(span)}`);
    }
  }

  return bundle.spans.length;
}

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: node scripts/import-clear-speakers.mjs <overlay.json>');
    process.exitCode = 1;
    return;
  }

  const raw = await fs.readFile(inputPath, 'utf8');
  const bundle = JSON.parse(raw);
  const count = validateOverlay(bundle);

  process.stdout.write(`OK: ${count} speaker spans for ${bundle.translationId}/${bundle.bookId}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
