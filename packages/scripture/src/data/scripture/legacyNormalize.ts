import type { InlineSpan, NormalizedVerse } from '@/data/scripture/types';
import type { Verse } from '@/data/scripture/verseDisplay';

function normalizeWhitespace(text: string) {
  return text.replace(/-\n/g, '').replace(/\s*\n\s*/g, ' ');
}

export function legacyVerseToNormalized(verse: Verse): NormalizedVerse {
  let text = '';
  const inlineSpans: InlineSpan[] = [];

  for (const segment of verse.segments) {
    const start = text.length;
    const piece = normalizeWhitespace(segment.text);
    text += piece;
    const end = text.length;

    if (segment.color === 'red') {
      inlineSpans.push({ start, end, kind: 'wj' });
    }

    if (segment.italic) {
      inlineSpans.push({ start, end, kind: 'it' });
    }

    if (segment.bold) {
      inlineSpans.push({ start, end, kind: 'bd' });
    }
  }

  return {
    number: verse.number,
    sectionMarker: verse.sectionMarker,
    text,
    inlineSpans: inlineSpans.length > 0 ? inlineSpans : undefined,
  };
}
