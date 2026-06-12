import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { parseChapterVerses, parseInlineMarkers, parseUsfmToChapterMap } from './lib/usfm-parse.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('parseInlineMarkers preserves wj spans', () => {
  const sample = String.raw`Hello \wj red words\wj* tail`;
  const { text, inlineSpans } = parseInlineMarkers(sample);

  assert.equal(text.includes('\\wj'), false);
  assert.ok(inlineSpans?.some((span) => span.kind === 'wj'));
  const wj = inlineSpans.find((span) => span.kind === 'wj');
  assert.ok(wj);
  assert.equal(text.slice(wj.start, wj.end), 'red words');
});

test('parseUsfmToChapterMap reads bundled sample', async () => {
  const filePath = path.join(__dirname, '../assets/usfm/matthew-eng-web-sample.usfm');
  const raw = await readFile(filePath, 'utf8');
  const map = parseUsfmToChapterMap(raw);

  assert.ok(map['4']);
  const verses = map['4'].verses;
  const v7 = verses.find((verse) => verse.number === 7);
  assert.ok(v7);
  assert.ok(v7.inlineSpans?.some((span) => span.kind === 'wj'));
});

test('parseChapterVerses splits multiple verses', () => {
  const body = String.raw`\v 1 First.\v 2 Second line.\v 3 Third.`;
  const verses = parseChapterVerses(body);

  assert.equal(verses.length, 3);
  assert.equal(verses[0].number, 1);
  assert.equal(verses[2].number, 3);
});
