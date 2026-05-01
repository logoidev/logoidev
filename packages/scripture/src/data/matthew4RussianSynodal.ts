export type VerseSegment = {
  text: string;
  color?: 'black' | 'red';
  italic?: boolean;
  bold?: boolean;
};

export type Verse = {
  number: number;
  segments: VerseSegment[];
  sectionMarker?: string;
};

export type BiblePageData = {
  rangeLabel: string;
  title: string;
  pageNumber: number;
  verses: Verse[];
};

export type BibleSpreadData = {
  leftPage: BiblePageData;
  rightPage: BiblePageData;
};

export type PassageSpread = {
  reference: 'Matthew 4:7-21';
  translation: 'Russian Synodal';
  source: string;
  leftVerses: Verse[];
  rightVerses: Verse[];
};

const black = (text: string): VerseSegment => ({ text });
const red = (text: string): VerseSegment => ({ text, color: 'red' });
const italic = (text: string): VerseSegment => ({ text, italic: true });

export const matthew4RussianSynodal: PassageSpread = {
  reference: 'Matthew 4:7-21',
  translation: 'Russian Synodal',
  source:
    'Mocked locally from Russian Synodal public-domain text; adapter can be replaced by an Open Bible API later.',
  leftVerses: [
    {
      number: 7,
      segments: [
        black('Иисус сказал ему: '),
        red('написано также:\nне искушай Господа Бога твоего.'),
      ],
    },
    {
      number: 8,
      segments: [
        black('Опять берет Его диавол на весьма\nвысокую гору и показывает Ему все\nцарства мира и славу их,'),
      ],
    },
    {
      number: 9,
      segments: [black('и говорит Ему: всё это дам Тебе,\nесли, пав, поклонишься мне.')],
    },
    {
      number: 10,
      segments: [
        black('Тогда Иисус говорит ему: '),
        red('отойди\nот Меня, сатана, ибо написано: Го-\nсподу Богу твоему поклоняйся и Ему\nодному служи.'),
      ],
    },
    {
      number: 11,
      segments: [black('Тогда оставляет Его диавол, и се,\nАнгелы приступили и служили Ему.')],
    },
    {
      number: 12,
      sectionMarker: '(Зач. 8)',
      segments: [
        black('Услышав же Иисус, что\nИоанн отдан '),
        italic('под стражу'),
        black(', удалился в\nГалилею'),
      ],
    },
    {
      number: 13,
      segments: [
        black('и, оставив Назарет, пришел и по-\nселился в Капернауме приморском,\nв пределах Завулоновых и Неффали-\nмовых,'),
      ],
    },
    {
      number: 14,
      segments: [black('да сбудется реченное через проро-\nка Исаию, который говорит:')],
    },
  ],
  rightVerses: [
    {
      number: 15,
      segments: [
        black('земля Завулонова и земля Неф-\nфалимова, на пути приморском, за\nИорданом, Галилея языческая,'),
      ],
    },
    {
      number: 16,
      segments: [
        black('народ, сидящий во тьме, увидел\nсвет великий, и сидящим в стране и\nтени смертной воссиял свет.'),
      ],
    },
    {
      number: 17,
      segments: [
        black('С того времени Иисус начал про-\nповедывать и говорить: '),
        red('покайтесь,\nибо приблизилось Царство Небес-\nное.'),
      ],
    },
    {
      number: 18,
      sectionMarker: '(Зач. 9)',
      segments: [
        black('Проходя же близ моря Га-\nлилейского, Он увидел двух братьев:\nСимона, называемого Петром, и Ан-\nдрея, брата его, закидывающих сети в\nморе, ибо они были рыболовы,'),
      ],
    },
    {
      number: 19,
      segments: [black('и говорит им: '), red('идите за Мною, и\nЯ сделаю вас ловцами человеков.')],
    },
    {
      number: 20,
      segments: [black('И они тотчас, оставив сети, по-\nследовали за Ним.')],
    },
    {
      number: 21,
      segments: [
        black('Оттуда, идя далее, увидел Он дру-\nгих двух братьев, Иакова Зеведеева\nи Иоанна, брата его, в лодке с Зеве-\nдеем, отцом их, починивающих сети\nсвои, и призвал их.'),
      ],
    },
  ],
};

export function getMatthew4RussianSynodalSpread() {
  return matthew4RussianSynodal;
}

const title = 'ЕВАНГЕЛИЕ ОТ МАТФЕЯ';

export const matthewRussianSynodalSpreads: BibleSpreadData[] = [
  {
    leftPage: {
      rangeLabel: '4, 7–4, 14',
      title,
      pageNumber: 14,
      verses: matthew4RussianSynodal.leftVerses,
    },
    rightPage: {
      rangeLabel: '4, 15–4, 21',
      title,
      pageNumber: 15,
      verses: matthew4RussianSynodal.rightVerses,
    },
  },
  {
    leftPage: {
      rangeLabel: '4, 22–4, 25',
      title,
      pageNumber: 16,
      verses: [
        {
          number: 22,
          segments: [black('И они тотчас, оставив лодку и отца своего, последовали за Ним.')],
        },
        {
          number: 23,
          segments: [
            black('И ходил Иисус по всей Галилее, уча в синагогах их и проповедуя Евангелие Царствия, и исцеляя всякую болезнь и всякую немощь в людях.'),
          ],
        },
        {
          number: 24,
          segments: [
            black('И прошел о Нем слух по всей Сирии; и приводили к Нему всех немощных, одержимых различными болезнями и припадками, и бесноватых, и лунатиков, и расслабленных, и Он исцелял их.'),
          ],
        },
        {
          number: 25,
          segments: [
            black('И следовало за Ним множество народа из Галилеи и Десятиградия, и Иерусалима, и Иудеи, и из-за Иордана.'),
          ],
        },
      ],
    },
    rightPage: {
      rangeLabel: '5, 1–5, 12',
      title,
      pageNumber: 17,
      verses: [
        {
          number: 1,
          sectionMarker: '(Зач. 10)',
          segments: [black('Увидев народ, Он взошел на гору; и, когда сел, приступили к Нему ученики Его.')],
        },
        {
          number: 2,
          segments: [black('И Он, отверзши уста Свои, учил их, говоря:')],
        },
        {
          number: 3,
          segments: [red('Блаженны нищие духом, ибо их есть Царство Небесное.')],
        },
        {
          number: 4,
          segments: [red('Блаженны плачущие, ибо они утешатся.')],
        },
        {
          number: 5,
          segments: [red('Блаженны кроткие, ибо они наследуют землю.')],
        },
        {
          number: 6,
          segments: [red('Блаженны алчущие и жаждущие правды, ибо они насытятся.')],
        },
        {
          number: 7,
          segments: [red('Блаженны милостивые, ибо они помилованы будут.')],
        },
        {
          number: 8,
          segments: [red('Блаженны чистые сердцем, ибо они Бога узрят.')],
        },
        {
          number: 9,
          segments: [red('Блаженны миротворцы, ибо они будут наречены сынами Божиими.')],
        },
        {
          number: 10,
          segments: [red('Блаженны изгнанные за правду, ибо их есть Царство Небесное.')],
        },
        {
          number: 11,
          segments: [red('Блаженны вы, когда будут поносить вас и гнать и всячески неправедно злословить за Меня.')],
        },
        {
          number: 12,
          segments: [red('Радуйтесь и веселитесь, ибо велика ваша награда на небесах: так гнали и пророков, бывших прежде вас.')],
        },
      ],
    },
  },
];

export function getMatthewRussianSynodalSpreads() {
  return matthewRussianSynodalSpreads;
}
