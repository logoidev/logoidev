import type { HighlightMode, InlineSpan, NormalizedVerse, SpeakerGroup, SpeakerSpan } from '@/data/scripture/types';
import type { Verse, VerseSegment } from '@/data/scripture/verseDisplay';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeWhitespace(text: string) {
  return text.replace(/-\n/g, '').replace(/\s*\n\s*/g, ' ');
}

function spanAtMidpoint(mid: number, spans: InlineSpan[], kind: InlineSpan['kind']) {
  return spans.filter((span) => span.kind === kind).find((span) => mid >= span.start && mid < span.end);
}

function overlayAtMidpoint(mid: number, overlays: SpeakerSpan[]) {
  let best: SpeakerSpan | undefined;
  for (const overlay of overlays) {
    if (mid < overlay.start || mid >= overlay.end) {
      continue;
    }

    if (!best || overlay.confidence > best.confidence) {
      best = overlay;
    }
  }

  return best;
}

function mapHighlightToColor(
  mode: HighlightMode,
  layer: { kind: 'none' | 'wj' | 'overlay'; group?: SpeakerGroup },
): VerseSegment['color'] {
  if (mode === 'off') {
    return 'black';
  }

  if (layer.kind === 'overlay' && layer.group) {
    if (mode === 'christ') {
      return layer.group === 'christ' ? 'red' : 'black';
    }

    if (mode === 'speakers') {
      if (layer.group === 'christ') {
        return 'red';
      }

      if (layer.group === 'prophet') {
        return 'blue';
      }

      return 'black';
    }
  }

  if (layer.kind === 'wj') {
    return mode === 'speakers' || mode === 'christ' ? 'red' : 'black';
  }

  return 'black';
}

function collapseSegments(segments: VerseSegment[]) {
  const merged: VerseSegment[] = [];

  for (const segment of segments) {
    const text = normalizeWhitespace(segment.text);
    if (!text) {
      continue;
    }

    const slice: VerseSegment = { ...segment, text };
    const last = merged.at(-1);
    if (
      last &&
      last.color === slice.color &&
      Boolean(last.italic) === Boolean(slice.italic) &&
      Boolean(last.bold) === Boolean(slice.bold)
    ) {
      last.text += slice.text;
    } else {
      merged.push(slice);
    }
  }

  return merged;
}

export function normalizedVerseToVerse(
  chapter: number,
  normalizedVerse: NormalizedVerse,
  overlaySpans: SpeakerSpan[],
  highlightMode: HighlightMode,
): Verse {
  const rawText = normalizedVerse.text;
  const text = normalizeWhitespace(rawText);
  const length = text.length;

  const verseOverlays = overlaySpans
    .filter((span) => span.chapter === chapter && span.verse === normalizedVerse.number)
    .map((span) => ({
      ...span,
      start: clamp(span.start, 0, length),
      end: clamp(span.end, 0, length),
    }))
    .filter((span) => span.end > span.start);

  const inlineSpans = normalizedVerse.inlineSpans ?? [];
  const wjSpans = inlineSpans.filter((span) => span.kind === 'wj');
  const typographySpans = inlineSpans.filter((span) => span.kind === 'it' || span.kind === 'bd');

  const boundaries = new Set<number>([0, length]);

  for (const span of inlineSpans) {
    boundaries.add(clamp(span.start, 0, length));
    boundaries.add(clamp(span.end, 0, length));
  }

  for (const span of verseOverlays) {
    boundaries.add(clamp(span.start, 0, length));
    boundaries.add(clamp(span.end, 0, length));
  }

  const sorted = Array.from(boundaries).sort((a, b) => a - b);
  const pieces: VerseSegment[] = [];

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const start = sorted[index]!;
    const end = sorted[index + 1]!;
    if (start === end) {
      continue;
    }

    const mid = Math.floor((start + end) / 2);
    const overlay = overlayAtMidpoint(mid, verseOverlays);
    const wj = spanAtMidpoint(mid, wjSpans, 'wj');
    const italic = Boolean(spanAtMidpoint(mid, typographySpans, 'it'));
    const bold = Boolean(spanAtMidpoint(mid, typographySpans, 'bd'));

    let layer: { kind: 'none' | 'wj' | 'overlay'; group?: SpeakerGroup } = { kind: 'none' };

    if (overlay) {
      layer = { kind: 'overlay', group: overlay.speakerGroup };
    } else if (wj) {
      layer = { kind: 'wj' };
    }

    const color = mapHighlightToColor(highlightMode, layer);
    const sliceText = text.slice(start, end);

    pieces.push({
      text: sliceText,
      color,
      italic: italic || undefined,
      bold: bold || undefined,
    });
  }

  return {
    number: normalizedVerse.number,
    sectionMarker: normalizedVerse.sectionMarker,
    segments: collapseSegments(pieces),
  };
}
