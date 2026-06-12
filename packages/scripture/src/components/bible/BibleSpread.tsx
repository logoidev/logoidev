import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BiblePage } from '@/components/bible/BiblePage';
import type { TextLayoutMode } from '@/components/bible/BibleTextFlow';
import { CenterCrease } from '@/components/bible/CenterCrease';
import type { BiblePageData } from '@/data/scripture/verseDisplay';
import { tokens } from '@/theme/bookTokens';

type BibleSpreadProps = {
  leftPage: BiblePageData;
  rightPage: BiblePageData;
  width: number;
  height: number;
  textLayoutMode: TextLayoutMode;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  showAnnotations?: boolean;
};

export function BibleSpread({
  leftPage,
  rightPage,
  width,
  height,
  textLayoutMode,
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
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
          rangeLabel={leftPage.rangeLabel}
          title={leftPage.title}
          verses={leftPage.verses}
          pageNumber={leftPage.pageNumber}
          width={pageWidth}
          height={spreadHeight}
          scale={scale}
          textLayoutMode={textLayoutMode}
          textFitStep={textFitStep}
        />
        <CenterCrease width={gutterWidth} height={spreadHeight} />
        <BiblePage
          side="right"
          rangeLabel={rightPage.rangeLabel}
          title={rightPage.title}
          verses={rightPage.verses}
          pageNumber={rightPage.pageNumber}
          width={pageWidth}
          height={spreadHeight}
          scale={scale}
          textLayoutMode={textLayoutMode}
          textFitStep={textFitStep}
        />
      </View>

      <Pressable
        accessibilityLabel="Previous spread"
        accessibilityRole="button"
        disabled={!canGoPrevious}
        onPress={onPrevious}
        style={({ pressed }) => [
          styles.edgeHotspot,
          styles.leftHotspot,
          pressed && canGoPrevious && styles.edgePressed,
          !canGoPrevious && styles.edgeDisabled,
          { width: Math.max(72, width * 0.14) },
        ]}>
        {canGoPrevious ? <Text style={[styles.edgeArrow, styles.leftArrow]}>‹</Text> : null}
      </Pressable>

      <Pressable
        accessibilityLabel="Next spread"
        accessibilityRole="button"
        disabled={!canGoNext}
        onPress={onNext}
        style={({ pressed }) => [
          styles.edgeHotspot,
          styles.rightHotspot,
          pressed && canGoNext && styles.edgePressed,
          !canGoNext && styles.edgeDisabled,
          { width: Math.max(72, width * 0.14) },
        ]}>
        {canGoNext ? <Text style={[styles.edgeArrow, styles.rightArrow]}>›</Text> : null}
      </Pressable>

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
  edgeHotspot: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    zIndex: 5,
  },
  leftHotspot: {
    left: 0,
  },
  rightHotspot: {
    right: 0,
  },
  edgePressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.035)',
  },
  edgeDisabled: {
    pointerEvents: 'none',
  },
  edgeArrow: {
    color: 'rgba(123, 96, 62, 0.92)',
    fontFamily: 'Georgia',
    fontSize: 64,
    fontWeight: '200',
    lineHeight: 70,
    textShadowColor: 'rgba(255, 249, 232, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  leftArrow: {
    transform: [{ translateX: -40 }, { scaleX: 0.62 }],
  },
  rightArrow: {
    transform: [{ translateX: 40 }, { scaleX: 0.62 }],
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
