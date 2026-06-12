import { useCallback, useEffect, useState } from 'react';

import { getBookTitleForTranslation, getChapter, getTranslationMetaForId } from '@/data/scripture/chapterRepository';
import {
  buildSpreadForAnchor,
  nextSpreadOpeningAnchor,
  previousSpreadOpeningAnchor,
} from '@/data/scripture/dynamicSpread';
import type { HighlightMode, VerseReference } from '@/data/scripture/types';
import type { BibleSpreadData } from '@/data/scripture/verseDisplay';
import { getSpeakerOverlay } from '@/data/bundles/registry';

export function useScriptureSpread(anchor: VerseReference, highlightMode: HighlightMode) {
  const [spread, setSpread] = useState<BibleSpreadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canGoNext, setCanGoNext] = useState(false);
  const [canGoPrevious, setCanGoPrevious] = useState(false);

  const getChapterForBook = useCallback(
    (chapter: number) => getChapter(anchor.translationId, anchor.bookId, chapter),
    [anchor.bookId, anchor.translationId],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const meta = getTranslationMetaForId(anchor.translationId);
      if (!meta) {
        if (!cancelled) {
          setSpread(null);
          setError('Unknown translation.');
          setLoading(false);
        }

        return;
      }

      const bookTitle = getBookTitleForTranslation(anchor.translationId, anchor.bookId);
      const overlay = getSpeakerOverlay(anchor.translationId);

      const [built, nextOpen, prevOpen] = await Promise.all([
        buildSpreadForAnchor(anchor, getChapterForBook, meta, bookTitle, overlay, highlightMode),
        nextSpreadOpeningAnchor(anchor, getChapterForBook, meta, bookTitle, overlay, highlightMode),
        previousSpreadOpeningAnchor(anchor, getChapterForBook, meta, bookTitle, overlay, highlightMode),
      ]);

      if (cancelled) {
        return;
      }

      if (!built) {
        setSpread(null);
        setError(
          'This chapter is not in the app bundle yet. Use Matthew 1 or 4–5 offline, host JSON at /scripture-data/{translation}/{book}/{chapter}.json, or set EXPO_PUBLIC_SCRIPTURE_CDN_BASE.',
        );
        setCanGoNext(false);
        setCanGoPrevious(false);
        setLoading(false);
        return;
      }

      setSpread(built);
      setCanGoNext(nextOpen !== null);
      setCanGoPrevious(prevOpen !== null);
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    anchor.bookId,
    anchor.chapter,
    anchor.translationId,
    anchor.verse,
    getChapterForBook,
    highlightMode,
  ]);

  return { spread, loading, error, canGoNext, canGoPrevious };
}
