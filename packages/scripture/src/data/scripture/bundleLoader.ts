import type { NormalizedVerse, NormalizedChapter, ScriptureBundle, SpreadLayout, TranslationMeta } from '@/data/scripture/types';
import { legacyVerseToNormalized } from '@/data/scripture/legacyNormalize';
import type { Verse } from '@/data/scripture/verseDisplay';

export type RawScriptureBundle = {
  translationId: string;
  translation: TranslationMeta;
  bookId: string;
  bookTitle: string;
  chapters?: Record<string, { verses: NormalizedVerse[] }>;
  legacyChapters?: Record<string, { verses: Verse[] }>;
  spreads: SpreadLayout[];
};

export function materializeBundle(raw: RawScriptureBundle): ScriptureBundle {
  const chapters: Record<string, NormalizedChapter> = {};

  if (raw.chapters) {
    for (const [key, chapter] of Object.entries(raw.chapters)) {
      chapters[key] = { verses: chapter.verses };
    }
  }

  if (raw.legacyChapters) {
    for (const [key, chapter] of Object.entries(raw.legacyChapters)) {
      chapters[key] = {
        verses: chapter.verses.map(legacyVerseToNormalized),
      };
    }
  }

  return {
    translationId: raw.translationId,
    translation: raw.translation,
    bookId: raw.bookId,
    bookTitle: raw.bookTitle,
    chapters,
    spreads: raw.spreads,
  };
}
