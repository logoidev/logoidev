import type { RawScriptureBundle } from '@/data/scripture/bundleLoader';
import { engWebMatthewRawBundle } from '@/data/bundles/engWebMat.bundle';
import { rusSynodalMatthewRawBundle } from '@/data/bundles/rusSynodalMat.bundle';
import { clearSpeakersMatthewOverlay } from '@/data/overlays/clearSpeakersMat.overlay';
import type { SpeakerOverlayBundle } from '@/data/scripture/types';

export const scriptureBundles: Record<string, RawScriptureBundle> = {
  'rus-synodal': rusSynodalMatthewRawBundle,
  'eng-web': engWebMatthewRawBundle,
};

export const speakerOverlays: Record<string, SpeakerOverlayBundle | undefined> = {
  'eng-web': clearSpeakersMatthewOverlay,
};

export const defaultTranslationId = 'rus-synodal';

export function getSpeakerOverlay(translationId: string): SpeakerOverlayBundle | null {
  return speakerOverlays[translationId] ?? null;
}

export function getRawBundle(translationId: string): RawScriptureBundle | undefined {
  return scriptureBundles[translationId];
}
