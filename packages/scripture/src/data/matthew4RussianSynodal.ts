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
