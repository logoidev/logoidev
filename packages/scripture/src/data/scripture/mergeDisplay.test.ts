import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizedVerseToVerse } from './mergeDisplay';
import type { NormalizedVerse, SpeakerSpan } from './types';

test('overlay span beats wj for the same character range in speakers mode', () => {
  const text = 'Jesus said: Hello world.';
  const start = text.indexOf('Hello');
  const end = text.length;

  const normalized: NormalizedVerse = {
    number: 7,
    text,
    inlineSpans: [{ start, end, kind: 'wj' }],
  };

  const overlays: SpeakerSpan[] = [
    {
      bookId: 'MAT',
      chapter: 4,
      verse: 7,
      start,
      end,
      speakerId: 'ISA',
      speakerLabel: 'Isaiah',
      speakerGroup: 'prophet',
      confidence: 0.95,
      source: 'clear-bible',
    },
  ];

  const verse = normalizedVerseToVerse(4, normalized, overlays, 'speakers');

  assert.ok(verse.segments.some((segment) => segment.color === 'blue' && segment.text.includes('Hello')));
});

test('wj renders red in christ mode without overlays', () => {
  const text = 'Then Jesus said: Go away.';
  const start = text.indexOf('Go');
  const end = text.length;

  const normalized: NormalizedVerse = {
    number: 10,
    text,
    inlineSpans: [{ start, end, kind: 'wj' }],
  };

  const verse = normalizedVerseToVerse(4, normalized, [], 'christ');

  assert.ok(verse.segments.some((segment) => segment.color === 'red' && segment.text.includes('Go away')));
});
