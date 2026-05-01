import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BibleTextFlow, type TextLayoutMode } from '@/components/bible/BibleTextFlow';
import type { Verse } from '@/data/matthew4RussianSynodal';
import { tokens } from '@/theme/bookTokens';

type BiblePageProps = {
  side: 'left' | 'right';
  rangeLabel: string;
  title: string;
  verses: Verse[];
  pageNumber: number;
  width: number;
  height: number;
  scale: number;
  textLayoutMode: TextLayoutMode;
  textFitStep: number;
};

export function BiblePage({ side, rangeLabel, title, verses, pageNumber, width, height, scale, textLayoutMode, textFitStep }: BiblePageProps) {
  const outerPadding = tokens.layout.pageOuterPadding * scale;
  const innerPadding = tokens.layout.pageInnerPadding * scale;
  const leftPadding = side === 'left' ? outerPadding : innerPadding;
  const rightPadding = side === 'left' ? innerPadding : outerPadding;
  const headerTop = 30 * scale;
  const headerHeight = 28 * scale;
  const textTop = 76 * scale;
  const footerBottom = 7 * scale;
  const footerHeight = 30 * scale;
  const textWidth = width - leftPadding - rightPadding;
  const textHeight = height - textTop - footerHeight - footerBottom;

  return (
    <View
      style={[
        styles.page,
        side === 'left' ? styles.leftPage : styles.rightPage,
        {
          width,
          height,
          borderRadius: tokens.layout.pageRadius,
        },
      ]}>
      <View
        style={[
          styles.header,
          {
            borderBottomWidth: Math.max(1, 1.4 * scale),
            height: headerHeight,
            left: leftPadding,
            right: rightPadding,
            top: headerTop,
          },
        ]}>
        <Text
          style={[
            styles.range,
            styles.rangeLeft,
            { bottom: 7 * scale, fontSize: tokens.typography.headerSize * scale, width: 92 * scale },
          ]}>
          {side === 'left' ? rangeLabel : ''}
        </Text>
        <Text
          style={[
            styles.title,
            {
              bottom: 7 * scale,
              fontSize: tokens.typography.titleSize * scale,
              left: 80 * scale,
              right: 80 * scale,
            },
          ]}
          numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={[
            styles.range,
            styles.rangeRight,
            { bottom: 7 * scale, fontSize: tokens.typography.headerSize * scale, width: 92 * scale },
          ]}>
          {side === 'right' ? rangeLabel : ''}
        </Text>
      </View>

      <View
        style={[
          styles.textBlock,
          {
            height: textHeight,
            left: leftPadding,
            top: textTop,
            width: textWidth,
          },
        ]}>
        <BibleTextFlow
          verses={verses}
          width={textWidth}
          height={textHeight}
          scale={scale}
          layoutMode={textLayoutMode}
          fitStep={textFitStep}
        />
      </View>

      <View style={[styles.footer, { bottom: footerBottom, height: footerHeight }]}>
        <Text style={[styles.footerOrnament, { fontSize: 21 * scale, lineHeight: footerHeight }]}>❧</Text>
        <Text style={[styles.pageNumber, { fontSize: tokens.typography.footerSize * scale }]}>{pageNumber}</Text>
        <Text style={[styles.footerOrnament, styles.footerOrnamentRight, { fontSize: 21 * scale, lineHeight: footerHeight }]}>❧</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: tokens.colors.paper,
    boxShadow: '0 6px 14px rgba(0, 0, 0, 0.12)',
    elevation: 5,
    overflow: 'hidden',
  },
  leftPage: {
  },
  rightPage: {
  },
  header: {
    borderBottomColor: '#191919',
    position: 'absolute',
  },
  range: {
    color: tokens.colors.text,
    fontFamily: 'Georgia',
    includeFontPadding: false,
    position: 'absolute',
  },
  rangeLeft: {
    left: 0,
  },
  rangeRight: {
    right: 0,
    textAlign: 'right',
  },
  title: {
    color: tokens.colors.red,
    fontFamily: 'Georgia',
    fontWeight: '800',
    includeFontPadding: false,
    letterSpacing: 0.6,
    position: 'absolute',
    textAlign: 'center',
  },
  textBlock: {
    overflow: 'hidden',
    position: 'absolute',
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  pageNumber: {
    color: tokens.colors.text,
    fontFamily: 'Georgia',
    fontWeight: '700',
    includeFontPadding: false,
    marginHorizontal: 4,
  },
  footerOrnament: {
    color: tokens.colors.red,
    fontFamily: 'Georgia',
    includeFontPadding: false,
  },
  footerOrnamentRight: {
    transform: [{ scaleX: -1 }],
  },
});
