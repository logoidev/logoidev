import React from 'react';
import { StyleSheet, Text } from 'react-native';

import type { Verse } from '@/data/scripture/verseDisplay';
import { tokens } from '@/theme/bookTokens';

type VerseTextProps = {
  verse: Verse;
  scale: number;
};

export function VerseText({ verse, scale }: VerseTextProps) {
  return (
    <Text style={[styles.verseLine, { fontSize: tokens.typography.bodySize * scale, lineHeight: tokens.typography.lineHeight * scale }]}>
      {verse.sectionMarker ? (
        <Text style={[styles.sectionMarker, { fontSize: tokens.typography.bodySize * scale }]}>
          {verse.sectionMarker}{' '}
        </Text>
      ) : null}
      <Text style={[styles.verseNumber, { fontSize: tokens.typography.verseSize * scale, lineHeight: tokens.typography.lineHeight * scale }]}>
        {verse.number}
      </Text>
      {verse.segments.map((segment, index) => (
        <Text
          key={`${verse.number}-${index}`}
          style={[
            segment.color === 'red' ? styles.redText : styles.blackText,
            segment.italic && styles.italic,
            segment.bold && styles.bold,
          ]}>
          {segment.text}
        </Text>
      ))}
    </Text>
  );
}

const styles = StyleSheet.create({
  verseLine: {
    color: tokens.colors.text,
    fontFamily: 'Georgia',
    includeFontPadding: false,
    marginBottom: 1,
    textAlign: 'left',
  },
  verseNumber: {
    color: tokens.colors.text,
    fontFamily: 'Georgia',
    includeFontPadding: false,
    transform: [{ translateY: -5 }],
  },
  blackText: {
    color: tokens.colors.text,
  },
  redText: {
    color: tokens.colors.red,
    fontWeight: '500',
  },
  italic: {
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: '700',
  },
  sectionMarker: {
    color: tokens.colors.red,
    fontFamily: 'Georgia',
    fontWeight: '800',
  },
});
