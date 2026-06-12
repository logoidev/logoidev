import { spreadFromSideRanges } from '@/data/scripture/passageResolver';
import type {
  HighlightMode,
  NormalizedChapter,
  NormalizedVerse,
  SpeakerOverlayBundle,
  SpreadSideRange,
  TranslationMeta,
  VerseReference,
} from '@/data/scripture/types';
import type { BibleSpreadData } from '@/data/scripture/verseDisplay';

/** Verses per page (two pages per spread, single chapter). */
export const DEFAULT_VERSES_LEFT = 8;
export const DEFAULT_VERSES_RIGHT = 8;

export function sortChapterVerses(verses: NormalizedVerse[]): NormalizedVerse[] {
  return [...verses].sort((left, right) => left.number - right.number);
}

export async function incrementVerse(
  ref: VerseReference,
  getChapter: (chapter: number) => Promise<NormalizedChapter | null>,
): Promise<VerseReference | null> {
  const chapter = await getChapter(ref.chapter);
  if (!chapter) {
    return null;
  }

  const sorted = sortChapterVerses(chapter.verses);
  const index = sorted.findIndex((verse) => verse.number === ref.verse);
  if (index === -1) {
    return null;
  }

  if (index + 1 < sorted.length) {
    return { ...ref, verse: sorted[index + 1]!.number };
  }

  const nextChapter = await getChapter(ref.chapter + 1);
  if (!nextChapter?.verses.length) {
    return null;
  }

  const nextSorted = sortChapterVerses(nextChapter.verses);

  return { ...ref, chapter: ref.chapter + 1, verse: nextSorted[0]!.number };
}

export async function buildSpreadForAnchor(
  anchor: VerseReference,
  getChapter: (chapter: number) => Promise<NormalizedChapter | null>,
  translation: TranslationMeta,
  bookTitle: string,
  overlay: SpeakerOverlayBundle | null,
  highlightMode: HighlightMode,
  versesLeft = DEFAULT_VERSES_LEFT,
  versesRight = DEFAULT_VERSES_RIGHT,
): Promise<BibleSpreadData | null> {
  const stride = versesLeft + versesRight;
  const chapter = await getChapter(anchor.chapter);
  if (!chapter?.verses.length) {
    return null;
  }

  const sorted = sortChapterVerses(chapter.verses);
  let index = sorted.findIndex((verse) => verse.number === anchor.verse);
  if (index === -1) {
    index = 0;
  }

  const blockStart = Math.floor(index / stride) * stride;
  const leftVerses = sorted.slice(blockStart, blockStart + versesLeft);
  const rightVerses = sorted.slice(blockStart + versesLeft, blockStart + stride);

  if (leftVerses.length === 0) {
    return null;
  }

  const leftRange: SpreadSideRange = {
    chapter: anchor.chapter,
    verseStart: leftVerses[0]!.number,
    verseEnd: leftVerses[leftVerses.length - 1]!.number,
  };

  const emptyRightRange: SpreadSideRange = {
    chapter: anchor.chapter,
    verseStart: 999_999,
    verseEnd: 999_999,
  };

  const rightRange: SpreadSideRange =
    rightVerses.length > 0
      ? {
          chapter: anchor.chapter,
          verseStart: rightVerses[0]!.number,
          verseEnd: rightVerses[rightVerses.length - 1]!.number,
        }
      : emptyRightRange;

  const verseMap = new Map<number, NormalizedVerse>();
  for (const verse of [...leftVerses, ...rightVerses]) {
    verseMap.set(verse.number, verse);
  }

  const chaptersPayload: Record<string, NormalizedChapter> = {
    [String(anchor.chapter)]: { verses: sortChapterVerses(Array.from(verseMap.values())) },
  };

  /** Footer marks: first verse on each column (not print page numbers). */
  const leftFooterMark: number | string = leftVerses[0]!.number;
  const rightFooterMark: number | string = rightVerses.length > 0 ? rightVerses[0]!.number : '–';

  let spread = spreadFromSideRanges(
    translation.id,
    translation,
    anchor.bookId,
    bookTitle,
    chaptersPayload,
    leftRange,
    rightRange,
    overlay,
    highlightMode,
    leftFooterMark,
    rightFooterMark,
  );

  if (rightVerses.length === 0) {
    spread = {
      ...spread,
      rightPage: {
        ...spread.rightPage,
        verses: [],
        rangeLabel: '',
        reference: spread.leftPage.reference,
        endReference: spread.leftPage.endReference,
      },
    };
  }

  return spread;
}

export async function nextSpreadOpeningAnchor(
  anchor: VerseReference,
  getChapter: (chapter: number) => Promise<NormalizedChapter | null>,
  translation: TranslationMeta,
  bookTitle: string,
  overlay: SpeakerOverlayBundle | null,
  highlightMode: HighlightMode,
  versesLeft = DEFAULT_VERSES_LEFT,
  versesRight = DEFAULT_VERSES_RIGHT,
): Promise<VerseReference | null> {
  const spread = await buildSpreadForAnchor(
    anchor,
    getChapter,
    translation,
    bookTitle,
    overlay,
    highlightMode,
    versesLeft,
    versesRight,
  );

  if (!spread) {
    return null;
  }

  const end =
    spread.rightPage.verses.length > 0 ? spread.rightPage.endReference : spread.leftPage.endReference;

  return incrementVerse(end, getChapter);
}

export async function previousSpreadOpeningAnchor(
  anchor: VerseReference,
  getChapter: (chapter: number) => Promise<NormalizedChapter | null>,
  translation: TranslationMeta,
  bookTitle: string,
  overlay: SpeakerOverlayBundle | null,
  highlightMode: HighlightMode,
  versesLeft = DEFAULT_VERSES_LEFT,
  versesRight = DEFAULT_VERSES_RIGHT,
): Promise<VerseReference | null> {
  const stride = versesLeft + versesRight;
  const spread = await buildSpreadForAnchor(
    anchor,
    getChapter,
    translation,
    bookTitle,
    overlay,
    highlightMode,
    versesLeft,
    versesRight,
  );

  if (!spread) {
    return null;
  }

  const leftStart = spread.leftPage.reference.verse;
  const chapterNumber = anchor.chapter;
  const chapter = await getChapter(chapterNumber);
  if (!chapter) {
    return null;
  }

  const sorted = sortChapterVerses(chapter.verses);
  const index = sorted.findIndex((verse) => verse.number === leftStart);
  if (index === -1) {
    return null;
  }

  const blockStart = Math.floor(index / stride) * stride;

  if (blockStart > 0) {
    const previousStartIndex = blockStart - stride;
    return {
      ...anchor,
      chapter: chapterNumber,
      verse: sorted[previousStartIndex]!.number,
    };
  }

  const previousChapterNumber = chapterNumber - 1;
  if (previousChapterNumber < 1) {
    return null;
  }

  const previousChapter = await getChapter(previousChapterNumber);
  if (!previousChapter?.verses.length) {
    return null;
  }

  const previousSorted = sortChapterVerses(previousChapter.verses);
  const lastBlockStart = Math.floor((previousSorted.length - 1) / stride) * stride;

  return {
    ...anchor,
    chapter: previousChapterNumber,
    verse: previousSorted[lastBlockStart]!.number,
  };
}
