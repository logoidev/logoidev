#!/usr/bin/env node
/**
 * Download eBible USFM archives and emit normalized chapter JSON for offline / static hosting.
 *
 * Sources (terms: https://ebible.org/ ):
 * - Russian Synodal → rus-synodal (USFM id russyn)
 * - World English Bible → eng-web (USFM id engwebp)
 *
 * English Standard Version (ESV) is not included: Crossway does not permit bulk redistribution;
 * use their API or a commercial license for ESV.
 *
 * Output layout (matches chapterRepository fetch paths):
 *   public/scripture-data/{translationId}/{BOOK}/{chapter}.json
 *
 * Usage:
 *   node scripts/download-ebible-usfm.mjs
 *   node scripts/download-ebible-usfm.mjs rus-synodal
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { parseUsfmToChapterMap } from './lib/usfm-parse.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.join(__dirname, '..');
const OUT_ROOT = path.join(PACKAGE_ROOT, 'public', 'scripture-data');
const CACHE_ROOT = path.join(PACKAGE_ROOT, '.cache', 'ebible-import');

/** @type {Array<{ translationId: string; zipUrl: string; zipFile: string; suffix: string }>} */
const TRANSLATIONS = [
  {
    translationId: 'rus-synodal',
    zipUrl: 'https://ebible.org/Scriptures/russyn_usfm.zip',
    zipFile: 'russyn_usfm.zip',
    suffix: 'russyn',
  },
  {
    translationId: 'eng-web',
    zipUrl: 'https://ebible.org/Scriptures/engwebp_usfm.zip',
    zipFile: 'engwebp_usfm.zip',
    suffix: 'engwebp',
  },
];

/**
 * USFM \\id line — `MAT` or numbered OT/NT books like `1SA`, `2PE`.
 */
function bookIdFromUsfm(source) {
  const head = source.slice(0, 1200);
  const m = head.match(/\\id\s+((?:[0-9][A-Z]{2})|(?:[A-Z]{3}))\s/m);
  return m ? m[1] : null;
}

async function fetchToFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET ${url} → ${res.status} ${res.statusText}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
}

function unzip(zipPath, outDir) {
  const r = spawnSync('unzip', ['-o', '-q', zipPath, '-d', outDir], { encoding: 'utf8' });
  if (r.error) {
    throw r.error;
  }

  if (r.status !== 0) {
    throw new Error(`unzip failed (status ${r.status}). Is unzip installed? ${r.stderr || ''}`);
  }
}

async function writeTranslation(translationId, usfmDir) {
  const names = await fs.readdir(usfmDir);
  const usfmFiles = names.filter((n) => n.toLowerCase().endsWith('.usfm'));

  let filesWritten = 0;
  let chaptersWritten = 0;

  for (const name of usfmFiles) {
    const filePath = path.join(usfmDir, name);
    const raw = await fs.readFile(filePath, 'utf8');
    const bookId = bookIdFromUsfm(raw);

    if (!bookId) {
      console.warn(`skip (no \\id): ${name}`);
      continue;
    }

    const chapters = parseUsfmToChapterMap(raw);
    const entries = Object.entries(chapters).filter(([k]) => /^\d+$/.test(k));

    if (entries.length === 0) {
      console.warn(`skip (no chapters): ${name} id=${bookId}`);
      continue;
    }

    for (const [chapterStr, data] of entries) {
      const chapter = Number.parseInt(chapterStr, 10);
      const verses = data?.verses;
      if (!Array.isArray(verses) || verses.length === 0) {
        continue;
      }

      const dir = path.join(OUT_ROOT, translationId, bookId);
      await fs.mkdir(dir, { recursive: true });
      const outPath = path.join(dir, `${chapter}.json`);
      await fs.writeFile(outPath, `${JSON.stringify({ verses })}\n`, 'utf8');
      chaptersWritten += 1;
    }

    filesWritten += 1;
    console.log(`  ${bookId}: ${entries.length} chapters (${name})`);
  }

  console.log(`→ ${translationId}: ${filesWritten} books, ${chaptersWritten} chapter files`);
}

async function main() {
  const only = process.argv[2]?.trim();
  const selected = only
    ? TRANSLATIONS.filter((t) => t.translationId === only || t.translationId.startsWith(only))
    : TRANSLATIONS;

  if (selected.length === 0) {
    console.error(`Unknown translation "${only}". Try: rus-synodal | eng-web`);
    process.exitCode = 1;
    return;
  }

  await fs.mkdir(CACHE_ROOT, { recursive: true });
  await fs.mkdir(OUT_ROOT, { recursive: true });

  console.log(`Output: ${OUT_ROOT}\n`);

  for (const t of selected) {
    const zipPath = path.join(CACHE_ROOT, t.zipFile);
    const extractDir = path.join(CACHE_ROOT, t.translationId, 'extracted');

    console.log(`[${t.translationId}] ${t.zipUrl}`);
    await fetchToFile(t.zipUrl, zipPath);
    await fs.rm(extractDir, { recursive: true, force: true });
    await fs.mkdir(extractDir, { recursive: true });
    unzip(zipPath, extractDir);
    await writeTranslation(t.translationId, extractDir);
  }

  console.log('\nDone. Web dev: chapters load from /scripture-data/... when served from Expo public/.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
