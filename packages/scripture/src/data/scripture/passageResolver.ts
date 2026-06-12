import { materializeBundle, type RawScriptureBundle } from '@/data/scripture/bundleLoader';
import { normalizedVerseToVerse } from '@/data/scripture/mergeDisplay';
import { compareReferences, isReferenceAfter, isReferenceBefore, referenceEquals } from '@/data/scripture/reference';
import type {
  BookId,
  HighlightMode,
  NormalizedChapter,
  NormalizedVerse,
  ScriptureBundle,
  SpeakerOverlayBundle,
  SpreadSideRange,
  TranslationMeta,
  VerseReference,
} from '@/data/scripture/types';
import type { BiblePageData, BibleSpreadData, Verse } from '@/data/scripture/verseDisplay';

function collectVersesForRange(bundle: ScriptureBundle, range: SpreadSideRange): NormalizedVerse[] {
  const chapterKey = String(range.chapter);
  const normalizedChapter = bundle.chapters[chapterKey];
  if (!normalizedChapter) {
    return [];
  }

  return normalizedChapter.verses
    .filter((verse) => verse.number >= range.verseStart && verse.number <= range.verseEnd)
    .sort((left, right) => left.number - right.number);
}

function formatRangeLabel(range: SpreadSideRange) {
  return `${range.chapter}, ${range.verseStart}–${range.chapter}, ${range.verseEnd}`;
}

function buildPageVerses(
  bundle: ScriptureBundle,
  overlays: SpeakerOverlayBundle | null,
  highlightMode: HighlightMode,
  range: SpreadSideRange,
  reference: VerseReference,
  endReference: VerseReference,
  rangeLabel: string,
  title: string,
  pageNumber: number | string,
): BiblePageData {
  const normalizedVerses = collectVersesForRange(bundle, range);
  const overlaySpans = overlays?.translationId === bundle.translationId && overlays.bookId === bundle.bookId ? overlays.spans : [];

  const verses: Verse[] = normalizedVerses.map((verse) =>
    normalizedVerseToVerse(range.chapter, verse, overlaySpans, highlightMode),
  );

  return {
    reference,
    endReference,
    rangeLabel,
    title,
    pageNumber,
    verses,
  };
}

export function spreadFromSideRanges(
  translationId: string,
  translation: TranslationMeta,
  bookId: BookId,
  bookTitle: string,
  chapters: Record<string, NormalizedChapter>,
  left: SpreadSideRange,
  right: SpreadSideRange,
  overlays: SpeakerOverlayBundle | null,
  highlightMode: HighlightMode,
  leftPageNumber: number | string,
  rightPageNumber: number | string,
): BibleSpreadData {
  const bundle: ScriptureBundle = {
    translationId,
    translation,
    bookId,
    bookTitle,
    chapters,
    spreads: [],
  };

  const leftRef: VerseReference = {
    translationId,
    bookId,
    chapter: left.chapter,
    verse: left.verseStart,
  };

  const leftEndRef: VerseReference = {
    translationId,
    bookId,
    chapter: left.chapter,
    verse: left.verseEnd,
  };

  const rightRef: VerseReference = {
    translationId,
    bookId,
    chapter: right.chapter,
    verse: right.verseStart,
  };

  const rightEndRef: VerseReference = {
    translationId,
    bookId,
    chapter: right.chapter,
    verse: right.verseEnd,
  };

  return {
    leftPage: buildPageVerses(
      bundle,
      overlays,
      highlightMode,
      left,
      leftRef,
      leftEndRef,
      formatRangeLabel(left),
      bookTitle,
      leftPageNumber,
    ),
    rightPage: buildPageVerses(
      bundle,
      overlays,
      highlightMode,
      right,
      rightRef,
      rightEndRef,
      formatRangeLabel(right),
      bookTitle,
      rightPageNumber,
    ),
  };
}

export function spreadsForBundle(
  raw: RawScriptureBundle,
  overlays: SpeakerOverlayBundle | null,
  highlightMode: HighlightMode,
): BibleSpreadData[] {
  const bundle = materializeBundle(raw);

  return bundle.spreads.map((spread) =>
    spreadFromSideRanges(
      bundle.translationId,
      bundle.translation,
      bundle.bookId,
      bundle.bookTitle,
      bundle.chapters,
      spread.left,
      spread.right,
      overlays,
      highlightMode,
      spread.leftPageNumber,
      spread.rightPageNumber,
    ),
  );
}

export function pageContainsReference(page: BiblePageData, reference: VerseReference) {
  if (page.reference.translationId !== reference.translationId || page.reference.bookId !== reference.bookId) {
    return false;
  }

  return (
    !isReferenceBefore(reference, page.reference) &&
    !isReferenceAfter(reference, page.endReference)
  );
}

export function findSpreadIndexByReference(spreads: BibleSpreadData[], reference: VerseReference) {
  const index = spreads.findIndex(
    (spread) => pageContainsReference(spread.leftPage, reference) || pageContainsReference(spread.rightPage, reference),
  );

  return index === -1 ? 0 : index;
}

export function getSpreadReference(spread: BibleSpreadData) {
  return spread.leftPage.reference;
}

export function buildPassageRequest(params: {
  translationId: string;
  bookId: string;
  chapter: number;
  verse: number;
}): VerseReference {
  return {
    translationId: params.translationId,
    bookId: params.bookId,
    chapter: params.chapter,
    verse: params.verse,
  };
}

export function passageParamsFromSpread(spread: BibleSpreadData) {
  const reference = getSpreadReference(spread);

  return passageParamsFromReference(reference);
}

export function passageParamsFromReference(reference: VerseReference) {
  return {
    translation: reference.translationId,
    book: reference.bookId,
    chapter: String(reference.chapter),
    verse: String(reference.verse),
  };
}

export { compareReferences as comparePassageReferences, referenceEquals };
