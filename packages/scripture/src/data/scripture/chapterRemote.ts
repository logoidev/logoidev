import { Platform } from 'react-native';

import { SCRIPTURE_CDN_BASE_URL, SCRIPTURE_STATIC_BASE_URL } from '@/constants/scriptureData';

function normalizeBase(base: string) {
  return base.replace(/\/$/, '');
}

/**
 * Ordered list of bases for `{base}/{translation}/{book}/{chapter}.json`.
 * Includes CDN, optional EXPO_PUBLIC_SCRIPTURE_STATIC_BASE, and (web only) same-origin `/scripture-data`.
 */
export function scriptureChapterFetchBases(): string[] {
  const bases = new Set<string>();

  if (SCRIPTURE_CDN_BASE_URL) {
    bases.add(normalizeBase(SCRIPTURE_CDN_BASE_URL));
  }

  if (SCRIPTURE_STATIC_BASE_URL) {
    bases.add(normalizeBase(SCRIPTURE_STATIC_BASE_URL));
  }

  if (Platform.OS === 'web') {
    const origin = (globalThis as { location?: { origin?: string } }).location?.origin;
    if (origin && origin !== 'null') {
      bases.add(`${origin}/scripture-data`);
    }
  }

  return Array.from(bases);
}
