import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { BibleSpread } from '@/components/bible/BibleSpread';
import type { TextLayoutMode } from '@/components/bible/BibleTextFlow';
import { getMatthew4RussianSynodalSpread } from '@/data/matthew4RussianSynodal';
import { tokens } from '@/theme/bookTokens';

const layoutOptions: Array<{ label: string; mode: TextLayoutMode; description: string }> = [
  {
    label: 'Single page flow',
    mode: 'continuous',
    description: 'Text flows continuously across the page body.',
  },
  {
    label: 'One verse at a time',
    mode: 'verse',
    description: 'Each verse lays out as its own measured block.',
  },
];

export function BibleSpreadScreen() {
  const { width, height } = useWindowDimensions();
  const passage = useMemo(getMatthew4RussianSynodalSpread, []);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [textLayoutMode, setTextLayoutMode] = useState<TextLayoutMode>('verse');
  const availableWidth = Math.max(320, width);
  const availableHeight = Math.max(320, height);
  const stageWidth = Math.min(availableWidth, availableHeight * tokens.layout.stageRatio, tokens.layout.designWidth);
  const stageHeight = stageWidth / tokens.layout.stageRatio;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      bounces={false}>
      <View style={[styles.mainColumn, { width: stageWidth }]}>
        <BibleSpread
          leftVerses={passage.leftVerses}
          rightVerses={passage.rightVerses}
          width={stageWidth}
          height={stageHeight}
          textLayoutMode={textLayoutMode}
        />
      </View>

      <View style={styles.settingsLayer}>
        <Pressable
          accessibilityLabel="Open text layout settings"
          accessibilityRole="button"
          onPress={() => setSettingsOpen((open) => !open)}
          style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </Pressable>

        {settingsOpen ? (
          <View style={styles.settingsPanel}>
            <Text style={styles.settingsTitle}>Text Layout</Text>
            {layoutOptions.map((option) => {
              const selected = option.mode === textLayoutMode;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={option.mode}
                  onPress={() => {
                    setTextLayoutMode(option.mode);
                    setSettingsOpen(false);
                  }}
                  style={[styles.option, selected && styles.optionSelected]}>
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {option.label}
                  </Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: tokens.colors.background,
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    padding: 0,
  },
  mainColumn: {
    overflow: 'hidden',
  },
  settingsLayer: {
    alignItems: 'flex-end',
    position: 'absolute',
    right: 18,
    top: 18,
    zIndex: 10,
  },
  settingsButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 253, 247, 0.94)',
    borderColor: '#d9d1c5',
    borderRadius: 18,
    borderWidth: 1,
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.14)',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  pressed: {
    opacity: 0.74,
  },
  settingsIcon: {
    color: tokens.colors.text,
    fontSize: 20,
    lineHeight: 24,
  },
  settingsPanel: {
    backgroundColor: 'rgba(255, 253, 247, 0.98)',
    borderColor: '#d9d1c5',
    borderRadius: 10,
    borderWidth: 1,
    boxShadow: '0 8px 26px rgba(0, 0, 0, 0.16)',
    gap: 8,
    marginTop: 8,
    padding: 10,
    width: 230,
  },
  settingsTitle: {
    color: tokens.colors.text,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  option: {
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  optionSelected: {
    backgroundColor: '#f8ece8',
    borderColor: tokens.colors.red,
  },
  optionLabel: {
    color: tokens.colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  optionLabelSelected: {
    color: tokens.colors.red,
  },
  optionDescription: {
    color: '#5f554d',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
});
