import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { BibleSpread } from '@/components/bible/BibleSpread';
import type { TextLayoutMode } from '@/components/bible/BibleTextFlow';
import { getBookTitleForTranslation, getChapter, getTranslationMetaForId } from '@/data/scripture/chapterRepository';
import { nextSpreadOpeningAnchor, previousSpreadOpeningAnchor } from '@/data/scripture/dynamicSpread';
import { defaultTranslationId, getRawBundle, getSpeakerOverlay } from '@/data/bundles/registry';
import { passageParamsFromReference } from '@/data/scripture/passageResolver';
import { normalizeBookId } from '@/data/scripture/reference';
import type { HighlightMode, VerseReference } from '@/data/scripture/types';
import { useScriptureSpread } from '@/hooks/useScriptureSpread';
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

const translationOptions: Array<{ id: string; label: string }> = [
  { id: 'rus-synodal', label: 'Russian Synodal' },
  { id: 'eng-web', label: 'World English Bible' },
];

const highlightOptions: Array<{ mode: HighlightMode; label: string; description: string }> = [
  { mode: 'christ', label: "Christ's words", description: 'Red letter for words of Christ (USFM \\wj or overlays).' },
  { mode: 'speakers', label: 'Speaker groups', description: 'Christ in red; prophets and overlays in blue where tagged.' },
  { mode: 'off', label: 'Off', description: 'No speaker highlighting.' },
];

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveIntParam(value: string | string[] | undefined, fallback: number) {
  const parsed = Number.parseInt(getParamValue(value) ?? '', 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeTranslationId(value: string | undefined) {
  const raw = value?.trim().toLowerCase() ?? '';
  if (!raw) {
    return defaultTranslationId;
  }

  if (getRawBundle(raw)) {
    return raw;
  }

  const aliases: Record<string, string> = {
    web: 'eng-web',
    'world-english-bible': 'eng-web',
    russian: 'rus-synodal',
    synodal: 'rus-synodal',
  };

  return aliases[raw] ?? defaultTranslationId;
}

function referenceFromParams(params: Record<string, string | string[] | undefined>): VerseReference {
  return {
    translationId: normalizeTranslationId(getParamValue(params.translation)),
    bookId: normalizeBookId(getParamValue(params.book ?? params.gospel)),
    chapter: positiveIntParam(params.chapter, 4),
    verse: positiveIntParam(params.verse, 7),
  };
}

export function BibleSpreadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [textLayoutMode, setTextLayoutMode] = useState<TextLayoutMode>('verse');
  const [highlightMode, setHighlightMode] = useState<HighlightMode>('christ');
  const translationId = normalizeTranslationId(getParamValue(params.translation));
  const requestedReference = referenceFromParams(params);
  const { spread, loading, error, canGoNext, canGoPrevious } = useScriptureSpread(requestedReference, highlightMode);

  const availableWidth = Math.max(320, width);
  const availableHeight = Math.max(320, height);
  const stageWidth = Math.min(availableWidth, availableHeight * tokens.layout.stageRatio, tokens.layout.designWidth);
  const stageHeight = stageWidth / tokens.layout.stageRatio;
  const activeSpread = spread;
  const screenBusy = loading;

  const makeGetChapter = useCallback(
    (tid: string, bid: string) => (c: number) => getChapter(tid, bid, c),
    [],
  );

  const goNext = useCallback(() => {
    setSettingsOpen(false);
    void (async () => {
      const meta = getTranslationMetaForId(translationId);
      if (!meta) {
        return;
      }

      const getCh = makeGetChapter(translationId, requestedReference.bookId);
      const bookTitle = getBookTitleForTranslation(translationId, requestedReference.bookId);
      const overlay = getSpeakerOverlay(translationId);
      const next = await nextSpreadOpeningAnchor(
        requestedReference,
        getCh,
        meta,
        bookTitle,
        overlay,
        highlightMode,
      );

      if (next) {
        router.setParams(passageParamsFromReference(next));
      }
    })();
  }, [highlightMode, makeGetChapter, requestedReference, router, translationId]);

  const goPrevious = useCallback(() => {
    setSettingsOpen(false);
    void (async () => {
      const meta = getTranslationMetaForId(translationId);
      if (!meta) {
        return;
      }

      const getCh = makeGetChapter(translationId, requestedReference.bookId);
      const bookTitle = getBookTitleForTranslation(translationId, requestedReference.bookId);
      const overlay = getSpeakerOverlay(translationId);
      const previous = await previousSpreadOpeningAnchor(
        requestedReference,
        getCh,
        meta,
        bookTitle,
        overlay,
        highlightMode,
      );

      if (previous) {
        router.setParams(passageParamsFromReference(previous));
      }
    })();
  }, [highlightMode, makeGetChapter, requestedReference, router, translationId]);

  const selectTranslation = (nextTranslationId: string) => {
    if (!getRawBundle(nextTranslationId)) {
      return;
    }

    const nextRef: VerseReference = {
      ...requestedReference,
      translationId: nextTranslationId,
    };

    router.setParams(passageParamsFromReference(nextRef));
    setSettingsOpen(false);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      bounces={false}
      nestedScrollEnabled>
      <View style={[styles.mainColumn, { width: stageWidth }]}>
        {screenBusy ? (
          <View style={[styles.loadingBox, { height: stageHeight }]}>
            <ActivityIndicator size="large" color={tokens.colors.red} />
          </View>
        ) : null}

        {error ? (
          <View style={[styles.errorBox, { minHeight: stageHeight * 0.35 }]}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {!screenBusy && activeSpread ? (
          <BibleSpread
            key={`${translationId}-${highlightMode}-${activeSpread.leftPage.pageNumber}-${activeSpread.rightPage.pageNumber}`}
            leftPage={activeSpread.leftPage}
            rightPage={activeSpread.rightPage}
            width={stageWidth}
            height={stageHeight}
            textLayoutMode={textLayoutMode}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            onNext={goNext}
            onPrevious={goPrevious}
          />
        ) : null}
      </View>

      <View style={styles.settingsLayer}>
        <Pressable
          accessibilityLabel="Open reader settings"
          accessibilityRole="button"
          onPress={() => setSettingsOpen((open) => !open)}
          style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </Pressable>

        {settingsOpen ? (
          <View style={styles.settingsPanel}>
            <Text style={styles.settingsTitle}>Translation</Text>
            {translationOptions.map((option) => {
              const selected = option.id === translationId;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={option.id}
                  onPress={() => selectTranslation(option.id)}
                  style={[styles.option, selected && styles.optionSelected]}>
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{option.label}</Text>
                </Pressable>
              );
            })}

            <Text style={[styles.settingsTitle, styles.settingsTitleSpaced]}>Speaker highlights</Text>
            {highlightOptions.map((option) => {
              const selected = option.mode === highlightMode;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={option.mode}
                  onPress={() => {
                    setHighlightMode(option.mode);
                    setSettingsOpen(false);
                  }}
                  style={[styles.option, selected && styles.optionSelected]}>
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </Pressable>
              );
            })}

            <Text style={[styles.settingsTitle, styles.settingsTitleSpaced]}>Text layout</Text>
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
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{option.label}</Text>
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
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  errorBox: {
    justifyContent: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  errorText: {
    color: '#5f554d',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
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
    maxHeight: 520,
    padding: 10,
    width: 280,
  },
  settingsTitle: {
    color: tokens.colors.text,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  settingsTitleSpaced: {
    marginTop: 6,
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
