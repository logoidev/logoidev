import React from 'react';
import { StyleSheet, View } from 'react-native';

import { BiblePage } from '@/components/bible/BiblePage';
import type { TextLayoutMode } from '@/components/bible/BibleTextFlow';
import { CenterCrease } from '@/components/bible/CenterCrease';
import type { Verse } from '@/data/matthew4RussianSynodal';
import { tokens } from '@/theme/bookTokens';

type BibleSpreadProps = {
  leftVerses: Verse[];
  rightVerses: Verse[];
  width: number;
  height: number;
  textLayoutMode: TextLayoutMode;
  showAnnotations?: boolean;
};

export function BibleSpread({
  leftVerses,
  rightVerses,
  width,
  height,
  textLayoutMode,
  showAnnotations,
}: BibleSpreadProps) {
  const scale = width / tokens.layout.designWidth;
  const gutterWidth = Math.max(14, tokens.layout.gutterWidth * scale);
  const spreadWidth = width;
  const spreadHeight = height;
  const pageWidth = (spreadWidth - gutterWidth) / 2;
  const textFitStep = textLayoutMode === 'verse' ? 0.8 : 0.76;

  return (
    <View style={[styles.stage, { width, height }]}>
      <View style={[styles.spread, { width: spreadWidth, height: spreadHeight }]}>
        <BiblePage
          side="left"
          rangeLabel="4, 7–4, 14"
          title="ЕВАНГЕЛИЕ ОТ МАТФЕЯ"
          verses={leftVerses}
          pageNumber={14}
          width={pageWidth}
          height={spreadHeight}
          scale={scale}
          textLayoutMode={textLayoutMode}
          textFitStep={textFitStep}
        />
        <CenterCrease width={gutterWidth} height={spreadHeight} />
        <BiblePage
          side="right"
          rangeLabel="4, 15–4, 21"
          title="ЕВАНГЕЛИЕ ОТ МАТФЕЯ"
          verses={rightVerses}
          pageNumber={15}
          width={pageWidth}
          height={spreadHeight}
          scale={scale}
          textLayoutMode={textLayoutMode}
          textFitStep={textFitStep}
        />
      </View>

      {showAnnotations ? (
        <>
          <View style={[styles.annotationLine, { left: width * 0.33, top: height * 0.18, width: width * 0.14 }]} />
          <View style={[styles.annotationDot, { left: width * 0.47, top: height * 0.175 }]} />
          <View style={[styles.bookmarkLine, { left: width * 0.595, top: height * 0.12, width: width * 0.15 }]} />
          <View style={[styles.annotationDot, { left: width * 0.585, top: height * 0.115 }]} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: tokens.colors.background,
    overflow: 'hidden',
  },
  spread: {
    alignItems: 'stretch',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  annotationLine: {
    backgroundColor: tokens.colors.annotation,
    height: 1,
    opacity: 0.7,
    position: 'absolute',
  },
  bookmarkLine: {
    backgroundColor: tokens.colors.annotation,
    height: 1,
    opacity: 0.7,
    position: 'absolute',
  },
  annotationDot: {
    backgroundColor: tokens.colors.annotation,
    borderRadius: 5,
    height: 8,
    position: 'absolute',
    width: 8,
  },
});
