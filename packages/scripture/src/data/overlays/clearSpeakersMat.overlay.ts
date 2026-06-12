import type { SpeakerOverlayBundle } from '@/data/scripture/types';

export const clearSpeakersMatthewOverlay: SpeakerOverlayBundle = {
  translationId: 'eng-web',
  bookId: 'MAT',
  alignmentNotes:
    'Sample Clear-style overlay: Isaiah oracle verses are tagged as prophet quotation spans for speaker highlighting.',
  spans: [
    {
      bookId: 'MAT',
      chapter: 4,
      verse: 15,
      start: 0,
      end: 100_000,
      speakerId: 'ISA',
      speakerLabel: 'Isaiah',
      speakerGroup: 'prophet',
      confidence: 0.74,
      source: 'clear-bible',
    },
    {
      bookId: 'MAT',
      chapter: 4,
      verse: 16,
      start: 0,
      end: 100_000,
      speakerId: 'ISA',
      speakerLabel: 'Isaiah',
      speakerGroup: 'prophet',
      confidence: 0.74,
      source: 'clear-bible',
    },
  ],
};
