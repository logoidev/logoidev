import assert from 'node:assert/strict';
import test from 'node:test';

import { buildSpreadForAnchor, sortChapterVerses } from '@/data/scripture/dynamicSpread';
import type { NormalizedChapter, TranslationMeta, VerseReference } from '@/data/scripture/types';

const mockMeta: TranslationMeta = {
  id: 'eng-web',
  label: 'WEB',
  hasWJ: true,
  hasSpeakerOverlay: false,
};

function chapterFromNumbers(numbers: number[]): NormalizedChapter {
  return {
    verses: numbers.map((number) => ({
      number,
      text: `Verse ${number}.`,
    })),
  };
}

test('sortChapterVerses orders numerically', () => {
  const sorted = sortChapterVerses([
    { number: 3, text: 'c' },
    { number: 1, text: 'a' },
    { number: 2, text: 'b' },
  ]);

  assert.deepEqual(
    sorted.map((verse) => verse.number),
    [1, 2, 3],
  );
});

test('buildSpreadForAnchor aligns sixteen-verse blocks within a chapter', async () => {
  const numbers = Array.from({ length: 24 }, (_, index) => index + 1);
  const chapter = chapterFromNumbers(numbers);

  const anchor: VerseReference = {
    translationId: 'eng-web',
    bookId: 'MAT',
    chapter: 1,
    verse: 10,
  };

  const getChapter = async (c: number) => (c === 1 ? chapter : null);

  const spread = await buildSpreadForAnchor(anchor, getChapter, mockMeta, 'MAT', null, 'off', 8, 8);

  assert.ok(spread);
  assert.equal(spread.leftPage.reference.verse, 1);
  assert.equal(spread.rightPage.endReference.verse, 16);
});

test('buildSpreadForAnchor second block starts at verse 17', async () => {
  const numbers = Array.from({ length: 30 }, (_, index) => index + 1);
  const chapter = chapterFromNumbers(numbers);

  const anchor: VerseReference = {
    translationId: 'eng-web',
    bookId: 'MAT',
    chapter: 1,
    verse: 20,
  };

  const getChapter = async (c: number) => (c === 1 ? chapter : null);

  const spread = await buildSpreadForAnchor(anchor, getChapter, mockMeta, 'MAT', null, 'off', 8, 8);

  assert.ok(spread);
  assert.equal(spread.leftPage.reference.verse, 17);
  assert.equal(spread.rightPage.endReference.verse, 30);
});
