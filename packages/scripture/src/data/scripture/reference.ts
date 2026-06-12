import type { BookId, VerseReference } from '@/data/scripture/types';

const bookAliases: Record<string, BookId> = {
  matthew: 'MAT',
  mat: 'MAT',
  mt: 'MAT',
  MAT: 'MAT',
  mrk: 'MRK',
  mark: 'MRK',
  MRK: 'MRK',
};

export function normalizeBookId(value: string | undefined): BookId {
  const key = value?.trim();
  if (!key) {
    return 'MAT';
  }

  const upper = key.toUpperCase();
  if (bookAliases[key.toLowerCase()]) {
    return bookAliases[key.toLowerCase()]!;
  }

  if (/^[1-4]?[A-Z]{2,3}$/.test(upper)) {
    return upper.length === 3 ? upper : upper.slice(0, 3);
  }

  return 'MAT';
}

export function compareReferences(left: VerseReference, right: VerseReference) {
  if (left.translationId !== right.translationId) {
    return left.translationId.localeCompare(right.translationId);
  }

  if (left.bookId !== right.bookId) {
    return left.bookId.localeCompare(right.bookId);
  }

  if (left.chapter !== right.chapter) {
    return left.chapter - right.chapter;
  }

  return left.verse - right.verse;
}

export function referenceEquals(left: VerseReference, right: VerseReference) {
  return compareReferences(left, right) === 0;
}

export function isReferenceBefore(left: VerseReference, right: VerseReference) {
  return compareReferences(left, right) < 0;
}

export function isReferenceAfter(left: VerseReference, right: VerseReference) {
  return compareReferences(left, right) > 0;
}

export function isReferenceInRange(
  ref: VerseReference,
  start: VerseReference,
  end: VerseReference,
) {
  return !isReferenceBefore(ref, start) && !isReferenceAfter(ref, end);
}
