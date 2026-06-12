import {
  layoutNextLine,
  prepareWithSegments,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from '@chenglou/pretext';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View, type TextStyle } from 'react-native';

import { VerseText } from '@/components/bible/VerseText';
import type { Verse, VerseSegment } from '@/data/scripture/verseDisplay';
import { tokens } from '@/theme/bookTokens';

type RunKind =
  | 'body'
  | 'christ'
  | 'speaker'
  | 'italic'
  | 'christItalic'
  | 'speakerItalic'
  | 'bold'
  | 'section'
  | 'verseNumber';

type GraphemeUnit = {
  text: string;
  kind: RunKind;
};

type FlowRun = {
  text: string;
  kind: RunKind;
};

type FlowLine = {
  x: number;
  y: number;
  width: number;
  targetWidth: number;
  wordSpacing: number;
  runs: FlowRun[];
};

type TextProjection = {
  bodySize: number;
  lineHeight: number;
  lines: FlowLine[];
};

export type TextLayoutMode = 'continuous' | 'verse';

type BibleTextFlowProps = {
  verses: Verse[];
  width: number;
  height: number;
  scale: number;
  layoutMode: TextLayoutMode;
  fitStep: number;
};

const FONT_FAMILY = 'Georgia, "Times New Roman", serif';
const graphemeSegmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;

function normalizeBibleText(text: string) {
  return text.replace(/-\n/g, '').replace(/\s*\n\s*/g, ' ');
}

function splitGraphemes(text: string) {
  if (graphemeSegmenter === null) {
    return Array.from(text);
  }

  return Array.from(graphemeSegmenter.segment(text), (segment) => segment.segment);
}

function pushUnits(units: GraphemeUnit[], text: string, kind: RunKind) {
  for (const grapheme of splitGraphemes(text)) {
    units.push({ text: grapheme, kind });
  }
}

function buildVerseUnits(verse: Verse) {
  const units: GraphemeUnit[] = [];

  if (verse.sectionMarker) {
    pushUnits(units, `${verse.sectionMarker} `, 'section');
  }

  pushUnits(units, String(verse.number), 'verseNumber');
  pushUnits(units, ' ', 'body');

  verse.segments.forEach((segment) => {
    const text = normalizeBibleText(segment.text);
    const kind: RunKind = (() => {
      if (segment.bold) {
        return 'bold';
      }

      const christ = segment.color === 'red';
      const speaker = segment.color === 'blue';

      if (christ && segment.italic) {
        return 'christItalic';
      }

      if (speaker && segment.italic) {
        return 'speakerItalic';
      }

      if (christ) {
        return 'christ';
      }

      if (speaker) {
        return 'speaker';
      }

      if (segment.italic) {
        return 'italic';
      }

      return 'body';
    })();

    pushUnits(units, text, kind);
  });

  return units;
}

function buildUnits(verses: Verse[]) {
  const units: GraphemeUnit[] = [];

  verses.forEach((verse, verseIndex) => {
    if (verseIndex > 0) {
      pushUnits(units, ' ', 'body');
    }

    units.push(...buildVerseUnits(verse));
  });

  return units;
}

function cursorToGraphemeOffset(
  prepared: PreparedTextWithSegments,
  segmentStarts: number[],
  cursor: LayoutCursor,
) {
  if (cursor.segmentIndex >= prepared.segments.length) {
    return segmentStarts[prepared.segments.length] ?? 0;
  }

  return (segmentStarts[cursor.segmentIndex] ?? 0) + cursor.graphemeIndex;
}

function getSegmentStarts(prepared: PreparedTextWithSegments) {
  const starts = [0];

  prepared.segments.forEach((segment) => {
    starts.push((starts.at(-1) ?? 0) + splitGraphemes(segment).length);
  });

  return starts;
}

function unitsToRuns(units: GraphemeUnit[], start: number, end: number) {
  const runs: FlowRun[] = [];
  const safeEnd = Math.min(end, units.length);

  for (let index = start; index < safeEnd; index += 1) {
    const unit = units[index];
    if (!unit) {
      continue;
    }

    const lastRun = runs.at(-1);
    if (lastRun?.kind === unit.kind) {
      lastRun.text += unit.text;
    } else {
      runs.push({ text: unit.text, kind: unit.kind });
    }
  }

  return runs;
}

function countExpandableSpaces(text: string) {
  return (text.match(/ /g) ?? []).length;
}

function applyWordSpacing(lines: FlowLine[], terminalIndex: number) {
  return lines.map((line, index) => {
    const text = line.runs.map((run) => run.text).join('');
    const spaces = countExpandableSpaces(text);
    const extra = line.targetWidth - line.width;
    const wordSpacing = index !== terminalIndex && spaces >= 3 && extra > 0 && extra / spaces <= 4 ? extra / spaces : 0;

    return { ...line, wordSpacing };
  });
}

function layoutUnits(
  units: GraphemeUnit[],
  font: string,
  width: number,
  lineHeight: number,
  startY: number,
  maxHeight: number,
  firstLineIndent = 0,
) {
  const text = units.map((unit) => unit.text).join('');
  const prepared = prepareWithSegments(text, font, { whiteSpace: 'normal', wordBreak: 'normal' });
  const segmentStarts = getSegmentStarts(prepared);
  const lines: FlowLine[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  let y = startY;

  while (y + lineHeight <= maxHeight) {
    const x = lines.length === 0 ? firstLineIndent : 0;
    const targetWidth = width - x;
    const line = layoutNextLine(prepared, cursor, targetWidth);
    if (line === null) {
      return {
        exhausted: true,
        lines: applyWordSpacing(lines, lines.length - 1),
        nextY: y,
      };
    }

    const startOffset = cursorToGraphemeOffset(prepared, segmentStarts, line.start);
    const endOffset = cursorToGraphemeOffset(prepared, segmentStarts, line.end);
    lines.push({
      x,
      y,
      width: line.width,
      targetWidth,
      wordSpacing: 0,
      runs: unitsToRuns(units, startOffset, endOffset),
    });
    cursor = line.end;
    y += lineHeight;
  }

  const exhausted = layoutNextLine(prepared, cursor, width) === null;

  return {
    exhausted,
    lines: applyWordSpacing(lines, exhausted ? lines.length - 1 : -1),
    nextY: y,
  };
}

function layoutContinuousProjection(verses: Verse[], font: string, width: number, height: number, lineHeight: number) {
  const units = buildUnits(verses);
  const result = layoutUnits(units, font, width, lineHeight, 0, height);

  return { exhausted: result.exhausted, lines: result.lines };
}

function layoutVerseProjection(verses: Verse[], font: string, width: number, height: number, lineHeight: number) {
  const lines: FlowLine[] = [];
  let y = 0;
  const verseGap = Math.max(1, lineHeight * 0.04);
  const firstLineIndent = Math.round(lineHeight * 0.62);

  for (const verse of verses) {
    const result = layoutUnits(buildVerseUnits(verse), font, width, lineHeight, y, height, firstLineIndent);
    lines.push(...result.lines);

    if (!result.exhausted) {
      return { exhausted: false, lines };
    }

    y = result.nextY + verseGap;
  }

  return { exhausted: true, lines };
}

function layoutProjection(verses: Verse[], width: number, height: number, scale: number, layoutMode: TextLayoutMode, fitStep: number): TextProjection {
  const bodySize = tokens.typography.bodySize * scale * fitStep;
  const lineHeight = tokens.typography.lineHeight * scale * fitStep;
  const font = `${bodySize}px ${FONT_FAMILY}`;
  const emptyProjection = { bodySize, lineHeight, lines: [] };

  // Pretext measures via the DOM; only available on web.
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return emptyProjection;
  }

  const result =
    layoutMode === 'continuous'
      ? layoutContinuousProjection(verses, font, width, height, lineHeight)
      : layoutVerseProjection(verses, font, width, height, lineHeight);

  return { bodySize, lineHeight, lines: result.lines };
}

function segmentStyle(segment: VerseSegment, bodySize: number, lineHeight: number): TextStyle {
  let color = tokens.colors.text;
  let fontWeight: TextStyle['fontWeight'] = '400';

  if (segment.color === 'red') {
    color = tokens.colors.red;
    fontWeight = '500';
  } else if (segment.color === 'blue') {
    color = tokens.colors.speaker;
  }

  if (segment.bold) {
    fontWeight = '700';
  }

  return {
    color,
    fontFamily: 'Georgia',
    fontSize: bodySize,
    lineHeight,
    fontWeight,
    fontStyle: segment.italic ? 'italic' : 'normal',
    includeFontPadding: false,
  };
}

function NativeContinuousText({
  verses,
  scale,
  fitStep,
}: {
  verses: Verse[];
  scale: number;
  fitStep: number;
}) {
  const bodySize = tokens.typography.bodySize * scale * fitStep;
  const lineHeight = tokens.typography.lineHeight * scale * fitStep;

  return (
    <Text style={[styles.nativeFlowRoot, { fontSize: bodySize, lineHeight }]}>
      {verses.map((verse, verseIndex) => (
        <React.Fragment key={verse.number}>
          {verseIndex > 0 ? ' ' : null}
          {verse.sectionMarker ? (
            <Text style={[styles.nativeSection, { fontSize: bodySize, lineHeight }]}>{verse.sectionMarker} </Text>
          ) : null}
          <Text
            style={[
              styles.nativeVerseNum,
              {
                fontSize: bodySize * 0.48,
                lineHeight,
                transform: [{ translateY: -bodySize * 0.34 }],
              },
            ]}>
            {verse.number}
          </Text>
          <Text> </Text>
          {verse.segments.map((segment, index) => (
            <Text key={`${verse.number}-${index}`} style={segmentStyle(segment, bodySize, lineHeight)}>
              {segment.text}
            </Text>
          ))}
        </React.Fragment>
      ))}
    </Text>
  );
}

function BibleTextFlowNative({ verses, width, height, scale, layoutMode, fitStep }: BibleTextFlowProps) {
  const verseScale = scale * fitStep;

  return (
    <View style={[styles.container, { width, height }]}>
      <ScrollView
        style={{ width, height }}
        contentContainerStyle={styles.nativeScrollContent}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}>
        {layoutMode === 'verse' ? (
          verses.map((verse) => <VerseText key={verse.number} verse={verse} scale={verseScale} />)
        ) : (
          <NativeContinuousText verses={verses} scale={scale} fitStep={fitStep} />
        )}
      </ScrollView>
    </View>
  );
}

function BibleTextFlowWeb({ verses, width, height, scale, layoutMode, fitStep }: BibleTextFlowProps) {
  const [projection, setProjection] = useState<TextProjection>(() => ({
    bodySize: tokens.typography.bodySize * scale * fitStep,
    lineHeight: tokens.typography.lineHeight * scale * fitStep,
    lines: [],
  }));

  useEffect(() => {
    setProjection(layoutProjection(verses, width, height, scale, layoutMode, fitStep));
  }, [fitStep, height, layoutMode, scale, verses, width]);

  return (
    <View style={[styles.container, { width, height }]}>
      {projection.lines.map((line, lineIndex) => (
        <Text
          key={`${lineIndex}-${line.width}`}
          selectable
          numberOfLines={1}
          style={[
            styles.line,
            {
              top: line.y,
              left: line.x,
              width: line.targetWidth,
              fontSize: projection.bodySize,
              lineHeight: projection.lineHeight,
            },
            line.wordSpacing > 0 && ({ wordSpacing: line.wordSpacing } as unknown as TextStyle),
          ]}>
          {line.runs.map((run, runIndex) => (
            <Text
              key={`${lineIndex}-${runIndex}`}
              style={[
                styles.run,
                (run.kind === 'christ' || run.kind === 'christItalic') && styles.red,
                (run.kind === 'speaker' || run.kind === 'speakerItalic') && styles.speaker,
                (run.kind === 'italic' || run.kind === 'christItalic' || run.kind === 'speakerItalic') &&
                  styles.italic,
                run.kind === 'bold' && styles.bold,
                run.kind === 'section' && styles.section,
                run.kind === 'verseNumber' && {
                  fontSize: projection.bodySize * 0.48,
                  lineHeight: projection.lineHeight,
                  transform: [{ translateY: -projection.bodySize * 0.34 }],
                },
              ]}>
              {run.text}
            </Text>
          ))}
        </Text>
      ))}
    </View>
  );
}

export function BibleTextFlow(props: BibleTextFlowProps) {
  if (Platform.OS !== 'web') {
    return <BibleTextFlowNative {...props} />;
  }

  return <BibleTextFlowWeb {...props} />;
}

const styles = StyleSheet.create({
  nativeFlowRoot: {
    color: tokens.colors.text,
    fontFamily: 'Georgia',
    fontWeight: '400',
    includeFontPadding: false,
    textAlign: 'left',
  },
  nativeSection: {
    color: tokens.colors.red,
    fontFamily: 'Georgia',
    fontWeight: '800',
    includeFontPadding: false,
  },
  nativeVerseNum: {
    color: tokens.colors.text,
    fontFamily: 'Georgia',
    fontWeight: '400',
    includeFontPadding: false,
  },
  nativeScrollContent: {
    flexGrow: 1,
    paddingBottom: 4,
  },
  container: {
    overflow: 'hidden',
  },
  line: {
    color: tokens.colors.text,
    fontFamily: 'Georgia',
    fontWeight: '400',
    includeFontPadding: false,
    left: 0,
    position: 'absolute',
  },
  run: {
    color: tokens.colors.text,
    fontFamily: 'Georgia',
    fontWeight: '400',
    includeFontPadding: false,
  },
  red: {
    color: tokens.colors.red,
  },
  speaker: {
    color: tokens.colors.speaker,
  },
  italic: {
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: '700',
  },
  section: {
    color: tokens.colors.red,
    fontWeight: '700',
  },
});
