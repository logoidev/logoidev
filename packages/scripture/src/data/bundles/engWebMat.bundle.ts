import type { RawScriptureBundle } from '@/data/scripture/bundleLoader';
import { engWebMatthewChapter1Verses } from '@/data/bundles/engWebMatthewChapter1';
import { rusSynodalMatthewRawBundle } from '@/data/bundles/rusSynodalMat.bundle';
import type { Verse, VerseSegment } from '@/data/scripture/verseDisplay';

const black = (text: string): VerseSegment => ({ text });
const red = (text: string): VerseSegment => ({ text, color: 'red' });
const italic = (text: string): VerseSegment => ({ text, italic: true });

const matthew4: Verse[] = [
  {
    number: 7,
    segments: [
      black('Jesus said to him, '),
      red('“Again, it is written, ‘You shall not test the Lord, your God.’”'),
    ],
  },
  {
    number: 8,
    segments: [
      black(
        'Again, the devil took him to an exceedingly high mountain and showed him all the kingdoms of the world, and their glory.',
      ),
    ],
  },
  {
    number: 9,
    segments: [black('He said to him, '), red('“I will give you all of these things if you will fall down and worship me.”')],
  },
  {
    number: 10,
    segments: [
      black('Then Jesus said to him, '),
      red('“Get behind me, Satan! For it is written, ‘You shall worship the Lord your God, and you shall serve him only.’”'),
    ],
  },
  {
    number: 11,
    segments: [black('Then the devil left him, and behold, angels came and served him.')],
  },
  {
    number: 12,
    sectionMarker: '(Section 8)',
    segments: [black('Now when Jesus heard that John was delivered up, he withdrew into Galilee.')],
  },
  {
    number: 13,
    segments: [
      black('Leaving Nazareth, he came and lived in Capernaum, which is by the sea, in the region of '),
      italic('Zebulun'),
      black(' and '),
      italic('Naphtali'),
      black(', '),
    ],
  },
  {
    number: 14,
    segments: [black('that it might be fulfilled which was spoken through Isaiah the prophet, saying,')],
  },
  {
    number: 15,
    segments: [
      black('“The land of Zebulun and the land of Naphtali, toward the sea, beyond the Jordan, Galilee of the Gentiles,'),
    ],
  },
  {
    number: 16,
    segments: [
      black(
        'the people who sat in darkness saw a great light, to those who sat in the region and shadow of death, light has dawned.”',
      ),
    ],
  },
  {
    number: 17,
    segments: [
      black('From that time, Jesus began to preach, and to say, '),
      red('“Repent! For the Kingdom of Heaven is at hand.”'),
    ],
  },
  {
    number: 18,
    sectionMarker: '(Section 9)',
    segments: [
      black(
        'Walking by the Sea of Galilee, he saw two brothers: Simon, who is called Peter, and Andrew, his brother, casting a net into the sea; for they were fishermen.',
      ),
    ],
  },
  {
    number: 19,
    segments: [black('He said to them, '), red('“Come, follow me, and I will make you fishers for men.”')],
  },
  {
    number: 20,
    segments: [black('They immediately left their nets and followed him.')],
  },
  {
    number: 21,
    segments: [
      black(
        'Going on from there, he saw two other brothers, James the son of Zebedee, and John his brother, in the boat with Zebedee their father, mending their nets. He called them.',
      ),
    ],
  },
  {
    number: 22,
    segments: [black('They immediately left the boat and their father, and followed him.')],
  },
  {
    number: 23,
    segments: [
      black(
        'Jesus went about in all Galilee, teaching in their synagogues, preaching the Good News of the Kingdom, and healing every disease and every sickness among the people.',
      ),
    ],
  },
  {
    number: 24,
    segments: [
      black(
        'The report about him went out into all Syria. They brought to him all who were sick, afflicted with various diseases and torments, possessed with demons, epileptics, and paralytics; and he healed them.',
      ),
    ],
  },
  {
    number: 25,
    segments: [
      black(
        'Great crowds from Galilee, Decapolis, Jerusalem, Judea, and from beyond the Jordan followed him.',
      ),
    ],
  },
];

const matthew5: Verse[] = [
  {
    number: 1,
    sectionMarker: '(Section 10)',
    segments: [
      black(
        'Seeing the multitudes, he went up onto the mountain. When he had sat down, his disciples came to him.',
      ),
    ],
  },
  {
    number: 2,
    segments: [black('He opened his mouth and taught them, saying,')],
  },
  {
    number: 3,
    segments: [red('“Blessed are the poor in spirit, for theirs is the Kingdom of Heaven.”')],
  },
  {
    number: 4,
    segments: [red('“Blessed are those who mourn, for they shall be comforted.”')],
  },
  {
    number: 5,
    segments: [red('“Blessed are the gentle, for they shall inherit the earth.”')],
  },
  {
    number: 6,
    segments: [red('“Blessed are those who hunger and thirst after righteousness, for they shall be filled.”')],
  },
  {
    number: 7,
    segments: [red('“Blessed are the merciful, for they shall obtain mercy.”')],
  },
  {
    number: 8,
    segments: [red('“Blessed are the pure in heart, for they shall see God.”')],
  },
  {
    number: 9,
    segments: [red('“Blessed are the peacemakers, for they shall be called children of God.”')],
  },
  {
    number: 10,
    segments: [red('“Blessed are those who have been persecuted for righteousness’ sake, for theirs is the Kingdom of Heaven.”')],
  },
  {
    number: 11,
    segments: [
      red(
        '“Blessed are you when people reproach you, persecute you, and say all kinds of evil against you falsely, for my sake.”',
      ),
    ],
  },
  {
    number: 12,
    segments: [
      red(
        '“Rejoice, and be exceedingly glad, for great is your reward in heaven. For that is how they persecuted the prophets who were before you.”',
      ),
    ],
  },
];

export const engWebMatthewRawBundle: RawScriptureBundle = {
  translationId: 'eng-web',
  translation: {
    id: 'eng-web',
    label: 'World English Bible',
    language: 'en',
    hasWJ: true,
    hasSpeakerOverlay: true,
  },
  bookId: 'MAT',
  bookTitle: 'THE GOSPEL ACCORDING TO MATTHEW',
  chapters: {
    '1': { verses: engWebMatthewChapter1Verses },
  },
  legacyChapters: {
    '4': { verses: matthew4 },
    '5': { verses: matthew5 },
  },
  spreads: rusSynodalMatthewRawBundle.spreads,
};
