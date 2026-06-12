/**
 * Normalized scripture bundle + overlay types for multilingual rendering.
 */

export type TranslationId = string;

/** USFM-style 3-letter book code (e.g. MAT, MRK). */
export type BookId = string;

export type VerseReference = {
  translationId: TranslationId;
  bookId: BookId;
  chapter: number;
  verse: number;
};

export type TranslationMeta = {
  id: TranslationId;
  label: string;
  language?: string;
  /** True when USFM red-letter \\wj spans are available for this translation. */
  hasWJ: boolean;
  /** When true, Clear-style speaker overlays may exist for this translation. */
  hasSpeakerOverlay: boolean;
};

/** Inline span inside verse body text (offsets are UTF-16 indices into `text`). */
export type InlineSpan = {
  start: number;
  end: number;
  kind: 'wj' | 'it' | 'bd' | 'add';
};

export type NormalizedVerse = {
  number: number;
  /** Verse body text without verse number prefix. */
  text: string;
  inlineSpans?: InlineSpan[];
  sectionMarker?: string;
};

export type NormalizedChapter = {
  verses: NormalizedVerse[];
};

export type SpreadSideRange = {
  chapter: number;
  verseStart: number;
  verseEnd: number;
};

export type SpreadLayout = {
  left: SpreadSideRange;
  right: SpreadSideRange;
  /** Decorative footer marks (historically print page numbers; may be verse anchors). */
  leftPageNumber: number | string;
  rightPageNumber: number | string;
};

export type ScriptureBundle = {
  translationId: TranslationId;
  translation: TranslationMeta;
  bookId: BookId;
  bookTitle: string;
  chapters: Record<string, NormalizedChapter>;
  spreads: SpreadLayout[];
};

export type SpeakerGroup = 'christ' | 'prophet' | 'other';

export type SpeakerSpanSource = 'clear-bible' | 'usfm-wj' | 'verse-level';

export type SpeakerSpan = {
  bookId: BookId;
  chapter: number;
  verse: number;
  start: number;
  end: number;
  speakerId: string;
  speakerLabel?: string;
  speakerGroup: SpeakerGroup;
  /** 0–1; lower confidence should lose merges against higher. */
  confidence: number;
  source: SpeakerSpanSource;
};

export type SpeakerOverlayBundle = {
  translationId: TranslationId;
  bookId: BookId;
  /** Optional alignment notes for debugging / UI. */
  alignmentNotes?: string;
  spans: SpeakerSpan[];
};

export type HighlightMode = 'christ' | 'speakers' | 'off';
