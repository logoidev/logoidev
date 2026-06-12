#!/usr/bin/env node
/**
 * Bundled USFM → normalized chapter JSON (stdout).
 * Usage: node scripts/import-usfm.mjs path/to/file.usfm
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { parseUsfmToChapterMap } from './lib/usfm-parse.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const inputPath = process.argv[2] ?? path.join(__dirname, '../assets/usfm/matthew-eng-web-sample.usfm');
  const raw = await fs.readFile(inputPath, 'utf8');
  const chapters = parseUsfmToChapterMap(raw);

  process.stdout.write(`${JSON.stringify({ chapters }, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
