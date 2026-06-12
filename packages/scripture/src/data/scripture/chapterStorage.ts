import { Platform } from 'react-native';

const STORAGE_PREFIX = 'scripture-chapter:';

function cacheFileName(translationId: string, bookId: string, chapter: number) {
  const safe = `${translationId}__${bookId}__${chapter}`.replace(/[^a-zA-Z0-9_.-]/g, '_');
  return `${safe}.json`;
}

export async function readChapterJsonFromDisk(translationId: string, bookId: string, chapter: number): Promise<string | null> {
  const key = `${translationId}/${bookId}/${chapter}`;

  if (Platform.OS === 'web') {
    if (typeof globalThis.localStorage === 'undefined') {
      return null;
    }

    return globalThis.localStorage.getItem(STORAGE_PREFIX + key);
  }

  const FileSystem = await import('expo-file-system/legacy');
  const baseDir = `${FileSystem.cacheDirectory ?? ''}scripture-cache/`;
  const path = `${baseDir}${cacheFileName(translationId, bookId, chapter)}`;
  const info = await FileSystem.getInfoAsync(path);

  if (!info.exists) {
    return null;
  }

  return FileSystem.readAsStringAsync(path);
}

export async function writeChapterJsonToDisk(translationId: string, bookId: string, chapter: number, json: string): Promise<void> {
  const key = `${translationId}/${bookId}/${chapter}`;

  if (Platform.OS === 'web') {
    if (typeof globalThis.localStorage === 'undefined') {
      return;
    }

    try {
      globalThis.localStorage.setItem(STORAGE_PREFIX + key, json);
    } catch {
      // Quota exceeded — ignore; memory + network still work for the session
    }

    return;
  }

  const FileSystem = await import('expo-file-system/legacy');
  const baseDir = `${FileSystem.cacheDirectory ?? ''}scripture-cache/`;
  await FileSystem.makeDirectoryAsync(baseDir, { intermediates: true }).catch(() => undefined);
  const path = `${baseDir}${cacheFileName(translationId, bookId, chapter)}`;
  await FileSystem.writeAsStringAsync(path, json);
}
