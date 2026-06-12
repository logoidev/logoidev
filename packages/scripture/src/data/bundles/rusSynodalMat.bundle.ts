import type { RawScriptureBundle } from '@/data/scripture/bundleLoader';
import { rusSynodalMatthewChapter1Verses } from '@/data/bundles/rusSynodalMatthewChapter1';
import { matthew4RussianSynodal, matthewRussianSynodalSpreads } from '@/data/matthew4RussianSynodal';

const chapter4Verses = [
  ...matthewRussianSynodalSpreads[0]!.leftPage.verses,
  ...matthewRussianSynodalSpreads[0]!.rightPage.verses,
  ...matthewRussianSynodalSpreads[1]!.leftPage.verses,
];

const chapter5Verses = [...matthewRussianSynodalSpreads[1]!.rightPage.verses];

export const rusSynodalMatthewRawBundle: RawScriptureBundle = {
  translationId: 'rus-synodal',
  translation: {
    id: 'rus-synodal',
    label: 'Russian Synodal',
    language: 'ru',
    hasWJ: true,
    hasSpeakerOverlay: false,
  },
  bookId: 'MAT',
  bookTitle: matthewRussianSynodalSpreads[0]!.leftPage.title,
  chapters: {
    '1': { verses: rusSynodalMatthewChapter1Verses },
  },
  legacyChapters: {
    '4': { verses: chapter4Verses },
    '5': { verses: chapter5Verses },
  },
  spreads: matthewRussianSynodalSpreads.map((spread) => ({
    left: {
      chapter: spread.leftPage.reference.chapter,
      verseStart: spread.leftPage.reference.verse,
      verseEnd: spread.leftPage.endReference.verse,
    },
    right: {
      chapter: spread.rightPage.reference.chapter,
      verseStart: spread.rightPage.reference.verse,
      verseEnd: spread.rightPage.endReference.verse,
    },
    leftPageNumber: spread.leftPage.pageNumber,
    rightPageNumber: spread.rightPage.pageNumber,
  })),
};

export const rusSynodalMatthewSource = matthew4RussianSynodal;
