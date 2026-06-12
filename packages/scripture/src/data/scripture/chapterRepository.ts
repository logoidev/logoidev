import type { NormalizedChapter, TranslationMeta } from '@/data/scripture/types';
import { materializeBundle, type RawScriptureBundle } from '@/data/scripture/bundleLoader';
import { getRawBundle } from '@/data/bundles/registry';
import { scriptureChapterFetchBases } from '@/data/scripture/chapterRemote';
import { readChapterJsonFromDisk, writeChapterJsonToDisk } from '@/data/scripture/chapterStorage';

const memory = new Map<string, NormalizedChapter>();
const MAX_MEMORY_CHAPTERS = 80;

function memoryKey(translationId: string, bookId: string, chapter: number) {
  return `${translationId}/${bookId}/${chapter}`;
}

function touchMemory(key: string, value: NormalizedChapter) {
  if (memory.has(key)) {
    memory.delete(key);
  }

  memory.set(key, value);

  while (memory.size > MAX_MEMORY_CHAPTERS) {
    const first = memory.keys().next().value as string | undefined;
    if (!first) {
      break;
    }

    memory.delete(first);
  }
}

function parseChapterJson(raw: string): NormalizedChapter | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || !('verses' in parsed)) {
      return null;
    }

    const verses = (parsed as { verses: NormalizedChapter['verses'] }).verses;
    if (!Array.isArray(verses)) {
      return null;
    }

    return { verses };
  } catch {
    return null;
  }
}

function chaptersFromRawBundle(raw: RawScriptureBundle): Record<string, NormalizedChapter> {
  return materializeBundle(raw).chapters;
}

function bundledChapter(translationId: string, bookId: string, chapter: number): NormalizedChapter | null {
  const raw = getRawBundle(translationId);
  if (!raw || raw.bookId !== bookId) {
    return null;
  }

  const chapters = chaptersFromRawBundle(raw);
  return chapters[String(chapter)] ?? null;
}

async function fetchRemoteChapter(translationId: string, bookId: string, chapter: number): Promise<NormalizedChapter | null> {
  const bases = scriptureChapterFetchBases();

  for (const base of bases) {
    const url = `${base}/${encodeURIComponent(translationId)}/${encodeURIComponent(bookId)}/${chapter}.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        continue;
      }

      const text = await response.text();
      const parsed = parseChapterJson(text);
      if (parsed) {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Loads a normalized chapter: memory → disk → bundled fixture → remote CDN (if configured).
 * Successful remote loads are persisted to disk for offline reuse.
 */
export async function getChapter(
  translationId: string,
  bookId: string,
  chapter: number,
  options?: { skipNetwork?: boolean },
): Promise<NormalizedChapter | null> {
  const key = memoryKey(translationId, bookId, chapter);

  const cached = memory.get(key);
  if (cached) {
    return cached;
  }

  const diskJson = await readChapterJsonFromDisk(translationId, bookId, chapter);
  const fromDisk = diskJson ? parseChapterJson(diskJson) : null;
  if (fromDisk) {
    touchMemory(key, fromDisk);
    return fromDisk;
  }

  const fromBundle = bundledChapter(translationId, bookId, chapter);
  if (fromBundle) {
    touchMemory(key, fromBundle);
    return fromBundle;
  }

  if (options?.skipNetwork) {
    return null;
  }

  const fromRemote = await fetchRemoteChapter(translationId, bookId, chapter);
  if (fromRemote) {
    touchMemory(key, fromRemote);
    await writeChapterJsonToDisk(translationId, bookId, chapter, JSON.stringify(fromRemote));
    return fromRemote;
  }

  return null;
}

export function peekBundledChapter(translationId: string, bookId: string, chapter: number): NormalizedChapter | null {
  return bundledChapter(translationId, bookId, chapter);
}

export function getTranslationMetaForId(translationId: string): TranslationMeta | null {
  const raw = getRawBundle(translationId);
  return raw?.translation ?? null;
}

export function getBookTitleForTranslation(translationId: string, bookId: string): string {
  const raw = getRawBundle(translationId);
  if (raw && raw.bookId === bookId) {
    return raw.bookTitle;
  }

  return bookId;
}
