/**
 * Minimal USFM parser for bundled translations: chapters, verses, and \\wj ... \\wj*.
 */

export function stripUsfmNotes(source) {
  return source
    .replace(/\\x[\s\S]*?\\x\*/g, '')
    .replace(/\\f[\s\S]*?\\f\*/g, '')
    .replace(/\\fe[\s\S]*?\\fe\*/g, '');
}

/**
 * @param {string} body text after \\v N
 * @returns {{ text: string, inlineSpans: Array<{ start: number, end: number, kind: 'wj' | 'it' | 'bd' | 'add' }> }}
 */
export function parseInlineMarkers(body) {
  let text = '';
  /** @type {Array<{ start: number, end: number, kind: 'wj' | 'it' | 'bd' }>} */
  const spans = [];

  const stack = [];

  const closeKind = (kind) => {
    for (let stackIndex = stack.length - 1; stackIndex >= 0; stackIndex -= 1) {
      const candidate = stack[stackIndex];
      if (candidate?.kind === kind) {
        const open = stack.splice(stackIndex, 1)[0];
        spans.push({
          start: open.start,
          end: text.length,
          kind,
        });
        return;
      }
    }
  };

  let index = 0;
  while (index < body.length) {
    if (body[index] !== '\\') {
      text += body[index];
      index += 1;
      continue;
    }

    const rest = body.slice(index);
    const markerMatch = rest.match(/^\\([a-z0-9]+)(\*?)\s*/);
    if (!markerMatch) {
      text += body[index];
      index += 1;
      continue;
    }

    const tag = markerMatch[1];
    const starred = markerMatch[2] === '*';
    index += markerMatch[0].length;

    if (tag === 'wj' && !starred) {
      stack.push({ kind: 'wj', start: text.length });
      continue;
    }

    if (tag === 'wj' && starred) {
      closeKind('wj');
      continue;
    }

    if (tag === 'it' && !starred) {
      stack.push({ kind: 'it', start: text.length });
      continue;
    }

    if (tag === 'it' && starred) {
      closeKind('it');
      continue;
    }

    if (tag === 'bd' && !starred) {
      stack.push({ kind: 'bd', start: text.length });
      continue;
    }

    if (tag === 'bd' && starred) {
      closeKind('bd');
      continue;
    }

    // Skip unknown markers without emitting
  }

  return {
    text,
    inlineSpans: spans.length > 0 ? mergeAdjacentSpans(spans) : undefined,
  };
}

function mergeAdjacentSpans(spans) {
  const merged = [];
  for (const span of spans) {
    const last = merged.at(-1);
    if (last && last.kind === span.kind && last.end === span.start) {
      last.end = span.end;
    } else {
      merged.push({ ...span });
    }
  }

  return merged;
}

/**
 * @param {string} chapterBody content after \\c N until next \\c or EOF
 */
export function parseChapterVerses(chapterBody) {
  /** @type {Array<{ number: number, text: string, inlineSpans?: Array<{ start: number, end: number, kind: 'wj' | 'it' | 'bd' | 'add' }>}>} */
  const verses = [];

  const verseRegex = /\\v\s+(\d+)\s+/g;
  let match;
  let lastIndex = 0;
  let lastVerseNum = null;

  while ((match = verseRegex.exec(chapterBody)) !== null) {
    if (lastVerseNum !== null) {
      const chunk = chapterBody.slice(lastIndex, match.index);
      const parsed = parseInlineMarkers(chunk);
      verses.push({
        number: lastVerseNum,
        text: parsed.text,
        inlineSpans: parsed.inlineSpans,
      });
    }

    lastVerseNum = Number.parseInt(match[1], 10);
    lastIndex = match.index + match[0].length;
  }

  if (lastVerseNum !== null) {
    const chunk = chapterBody.slice(lastIndex);
    const parsed = parseInlineMarkers(chunk);
    verses.push({
      number: lastVerseNum,
      text: parsed.text,
      inlineSpans: parsed.inlineSpans,
    });
  }

  verses.sort((a, b) => a.number - b.number);

  return verses;
}

/**
 * Parse full USFM source; returns map of chapter number -> verses.
 */
export function parseUsfmToChapterMap(source) {
  const cleaned = stripUsfmNotes(source);
  const chapters = {};

  const chapterParts = cleaned.split(/\\c\s+(\d+)/);
  for (let index = 1; index < chapterParts.length; index += 2) {
    const chapterNum = chapterParts[index];
    const body = chapterParts[index + 1] ?? '';
    chapters[chapterNum] = {
      verses: parseChapterVerses(body),
    };
  }

  return chapters;
}
