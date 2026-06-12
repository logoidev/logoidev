/**
 * Display-layer verse model consumed by BibleTextFlow / BiblePage.
 */

import type { VerseReference } from '@/data/scripture/types';

export type VerseSegment = {
  text: string;
  color?: 'black' | 'red' | 'blue';
  italic?: boolean;
  bold?: boolean;
};

export type Verse = {
  number: number;
  segments: VerseSegment[];
  sectionMarker?: string;
};

export type BiblePageData = {
  reference: VerseReference;
  endReference: VerseReference;
  rangeLabel: string;
  title: string;
  /** Shown in the page footer: print-style sheet number, or starting verse, etc. */
  pageNumber: number | string;
  verses: Verse[];
};

export type BibleSpreadData = {
  leftPage: BiblePageData;
  rightPage: BiblePageData;
};
