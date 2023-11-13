import languages, { ISOLangCode } from '@mangayomu/language-codes';
import { sub } from 'date-fns';
import { MangaMultilingualChapter } from '../scraper/scraper.interfaces';
import {
  MangaParkV5GetContentChapterList,
  MangaParkV5GetComicRangeList,
} from './MangaPark_v5.interfaces';

export const GENRES = {
  Artbook: 'artbook',
  Cartoon: 'cartoon',
  Comic: 'comic',
  Doujinshi: 'doujinshi',
  Imageset: 'imageset',
  Manga: 'manga',
  Manhua: 'manhua',
  Manhwa: 'manhwa',
  Webtoon: 'webtoon',
  Josei: 'josei',
  Seinen: 'seinen',
  Shoujo: 'shoujo',
  'Shoujo ai': 'shoujo_ai',
  Shounen: 'shounen',
  'Shounen ai': 'shounen_ai',
  Yaoi: 'yaoi',
  Yuri: 'yuri',
  Gore: 'gore',
  Bloody: 'bloody',
  Violence: 'violence',
  Ecchi: 'ecchi',
  Adult: 'adult',
  Mature: 'mature',
  Smut: 'smut',
  Hentai: 'hentai',
  '4-Koma': '_4_koma',
  Action: 'action',
  Adaptation: 'adaptation',
  Adventure: 'adventure',
  Aliens: 'aliens',
  Animals: 'animals',
  Anthology: 'anthology',
  Cars: 'cars',
  Comedy: 'comedy',
  Cooking: 'cooking',
  Crime: 'crime',
  Crossdressing: 'crossdressing',
  Cultivation: 'cultivation',
  Delinquents: 'delinquents',
  Dementia: 'dementia',
  Demons: 'demons',
  Drama: 'drama',
  Fantasy: 'fantasy',
  'Fan-Colored': 'fan_colored',
  'Full Color': 'full_color',
  Game: 'game',
  'Gender Bender': 'gender_bender',
  Genderswap: 'genderswap',
  Ghosts: 'ghosts',
  Gyaru: 'gyaru',
  Harem: 'harem',
  Historical: 'historical',
  Horror: 'horror',
  Incest: 'incest',
  Isekai: 'isekai',
  Kids: 'kids',
  Loli: 'loli',
  Magic: 'magic',
  'Magical Girls': 'magical_girls',
  'Martial Arts': 'martial_arts',
  Mecha: 'mecha',
  Medical: 'medical',
  Military: 'military',
  'Monster Girls': 'monster_girls',
  Monsters: 'monsters',
  Music: 'music',
  Mystery: 'mystery',
  'Netorare/NTR': 'netorare',
  Ninja: 'ninja',
  'Office Workers': 'office_workers',
  Oneshot: 'oneshot',
  Parody: 'parody',
  Philosophical: 'philosophical',
  Police: 'police',
  'Post-Apocalyptic': 'post_apocalyptic',
  Psychological: 'psychological',
  Reincarnation: 'reincarnation',
  'Reverse Harem': 'reverse_harem',
  Romance: 'romance',
  Samurai: 'samurai',
  'School Life': 'school_life',
  'Sci-Fi': 'sci_fi',
  Shota: 'shota',
  'Slice of Life': 'slice_of_life',
  'SM/BDSM': 'sm_bdsm',
  Space: 'space',
  Sports: 'sports',
  'Super Power': 'super_power',
  Superhero: 'superhero',
  Supernatural: 'supernatural',
  Survival: 'survival',
  Thriller: 'thriller',
  'Time Travel': 'time_travel',
  'Traditional Games': 'traditional_games',
  Tragedy: 'tragedy',
  Vampires: 'vampires',
  'Video Games': 'video_games',
  Villainess: 'villainess',
  'Virtual Reality': 'virtual_reality',
  Wuxia: 'wuxia',
  Xianxia: 'xianxia',
  Xuanhuan: 'xuanhuan',
  Zombies: 'zombies',
  Chinese: 'zh',
  English: 'en',
  Japanese: 'ja',
  Korean: 'ko',
  Pending: 'pending',
  Ongoing: 'ongoing',
  Completed: 'completed',
  Hiatus: 'hiatus',
  Cancelled: 'cancelled',
};

export const VIEW_CHAPTERS = {
  Any: null,
  '0': '0',
  '1+': '1',
  '10+': '10',
  '20+': '20',
  '30+': '30',
  '40+': '40',
  '50+': '50',
  '60+': '60',
  '70+': '70',
  '80+': '80',
  '90+': '90',
  '100+': '100',
  '200+': '200',
  '300+': '300',
  '200~299': '200-299',
  '199~100': '199-100',
  '99~90': '99-90',
  '89~80': '89-80',
  '79~70': '79-70',
  '69~60': '69-60',
  '59~50': '59-50',
  '49~40': '49-40',
  '39~30': '39-30',
  '29~20': '29-20',
  '19~10': '19-10',
  '9~1': '9-1',
} as const;

export const TYPE = {
  Any: null,
  Artbook: 'artbook',
  Cartoon: 'cartoon',
  Comic: 'comic',
  Doujinshi: 'doujinshi',
  Imageset: 'imageset',
  Manga: 'manga',
  Manhua: 'manhua',
  Manhwa: 'manhwa',
  Webtoon: 'webtoon',
  Western: 'western',
} as const;

export const OFFICIAL_WORK_STATUS = {
  All: null,
  Pending: 'pending',
  Ongoing: 'ongoing',
  Completed: 'completed',
  Hiatus: 'hiatus',
  Cancelled: 'cancelled',
} as const;

export const ORDER_BY = {
  'Rating Score': 'field_score',
  'Most Follows': 'field_follow',
  'Most Reviews': 'field_review',
  'Most Comments': 'field_post',
  'Most Chapters': 'field_chapter',
  'Latest Upload': 'field_upload',
  'Recently Created': 'field_public',
  'Name A-Z': 'field_name',
} as const;

export const ORIGINAL_WORK_LANGUAGE = {
  English: 'en',
  Chinese: 'zh',
  Any: null,
  Japanese: 'ja',
  Korean: 'ko',
};

/**
 * Parse title
 * @param title The title extracted from jquery
 * @returns Returns the parsed title
 */
export function extractChapterTitle(title: string) {
  const p = title.trim();

  return p
    .substring(p.indexOf(' ') + 1)
    .trim()
    .replace(/\s\s+/g, ' ');
}

/**
 * Parse a string to only show digits
 * @param str The string to show only numbers
 * @returns Returns the string with numbers only
 */
export function digitsOnly(str: string) {
  return str.replace(/[^0-9.]/g, '');
}

/**
 * Parse timestamp (e.g. 100 days ago) into a date string object
 * @param txt The text to parse into a date
 * @returns Returns a date string object
 */
export function parseTimestamp(txt: string) {
  const time = parseInt(txt.replace(/\D/g, ''));
  if (txt.indexOf('days') !== -1 || txt.indexOf('day') !== -1) {
    return sub(Date.now(), {
      days: time,
    }).toString();
  }
  if (txt.indexOf('hours') !== -1 || txt.indexOf('hour') !== -1) {
    return sub(Date.now(), {
      hours: time,
    }).toString();
  }

  if (txt.indexOf('mins') !== -1 || txt.indexOf('min') !== -1) {
    return sub(Date.now(), {
      minutes: time,
    }).toString();
  }

  if (txt.indexOf('secs') !== -1 || txt.indexOf('sec') !== -1) {
    return sub(Date.now(), {
      seconds: time,
    }).toString();
  }

  throw Error('Invalid date parsed: ' + txt);
}

/**
 * Get v3 URL of MangaPark
 * @param urlPath The path of the manga. The API gives V5 path
 * @returns Returns the V3 version of the url path
 */
export function getV3URL(urlPath: string): string {
  const newUrlPath = urlPath.replace('/title/', '/comic/');
  const i = newUrlPath.indexOf('-');
  return i === -1 ? newUrlPath : newUrlPath.substring(0, i);
}

/**
 * Inverse of getV3URL
 * @param urlPath The path of the manga.
 * @returns Returns the V5 version of the URL path
 */
export function getV5URL(urlPath: string): string {
  const newUrlPath = urlPath.replace('/comic/', '/title/');
  return newUrlPath;
}

export function compressURL(urlPath: string): string {
  /**
   * Compress the URL!
   *
   * From: https://mangapark.net/title/119777-kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen/7683399-en-ch.281.1
   * To: https://mangapark.net/title/119777/7683399
   */

  const end = urlPath.substring(urlPath.lastIndexOf('/'));
  const compressed =
    urlPath.substring(0, urlPath.indexOf('-')) +
    end.substring(0, end.indexOf('-'));

  return compressed;
}

export function compressURLWorklet(urlPath: string): string {
  'worklet';
  /**
   * Compress the URL!
   *
   * From: https://mangapark.net/title/119777-kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen/7683399-en-ch.281.1
   * To: https://mangapark.net/title/119777/7683399
   */

  const end = urlPath.substring(urlPath.lastIndexOf('/'));
  const compressed =
    urlPath.substring(0, urlPath.indexOf('-')) +
    end.substring(0, end.indexOf('-'));

  return compressed;
}

export const mapMultilingualQueryResponseFallback = (
  response: MangaParkV5GetContentChapterList,
  hostLink: string,
): MangaMultilingualChapter[] => {
  'worklet';
  const mapped: MangaMultilingualChapter[] = [];

  let i = response.data.get_content_chapter_list.length - 1;
  let j = response.data.get_content_chapter_list.length - 2;
  while (i >= 0 && j >= 0) {
    const short = response.data.get_content_chapter_list;
    while (j >= 0 && short[j].data.lang === short[i].data.lang) {
      j--;
    }
    while (i > j) {
      const language = short[i].data.lang.substring(0, 2) as ISOLangCode;
      mapped.push({
        index: i - j - 1,
        date: new Date(short[i].data.datePublic).toString(),
        language: short[i].data.lang.substring(0, 2) as ISOLangCode,
        link: `https://${hostLink}${compressURLWorklet(short[i].data.urlPath)}`,
        name: `Chapter ${short[i].data.serial} (${languages[language].nativeName})`,
        subname: short[i].data.title,
      });
      i--;
    }
    j--;
  }
  return mapped;
};

export const mapMultilingualQueryResponse = (
  response: MangaParkV5GetContentChapterList,
  hostLink: string,
): string => {
  'worklet';
  const mapped: MangaMultilingualChapter[] = [];

  let i = response.data.get_content_chapter_list.length - 1;
  let j = response.data.get_content_chapter_list.length - 2;
  while (i >= 0 && j >= 0) {
    const short = response.data.get_content_chapter_list;
    while (j >= 0 && short[j].data.lang === short[i].data.lang) {
      j--;
    }
    while (i > j) {
      const language = short[i].data.lang.substring(0, 2) as ISOLangCode;
      mapped.push({
        index: i - j - 1,
        date: new Date(short[i].data.datePublic).toString(),
        language: short[i].data.lang.substring(0, 2) as ISOLangCode,
        link: `https://${hostLink}${compressURLWorklet(short[i].data.urlPath)}`,
        name: `Chapter ${short[i].data.serial} (${languages[language].nativeName})`,
        subname: short[i].data.title,
      });
      i--;
    }
    j--;
  }
  return JSON.stringify(mapped);
};

export const mapQueryResponse = (
  response: MangaParkV5GetComicRangeList,
  hostLink: string,
) => {
  'worklet';
  const mapped: MangaMultilingualChapter[] = [];

  for (
    let i = response.data.get_content_comicChapterRangeList.items.length - 1;
    i >= 0;
    i--
  ) {
    const x = response.data.get_content_comicChapterRangeList.items[i];
    mapped.push({
      index: i,
      date: new Date(x.chapterNodes[0].data.datePublic).toString(),
      language: x.chapterNodes[0].data.lang.substring(0, 2) as ISOLangCode,
      link: `https://${hostLink}${compressURLWorklet(
        x.chapterNodes[0].data.urlPath,
      )}`,
      name: `Chapter ${x.serial}`,
      subname: x.chapterNodes[0].data.title,
    });
  }
  return JSON.stringify(mapped);
};

export const mapQueryResponseFallback = (
  response: MangaParkV5GetComicRangeList,
  hostLink: string,
) => {
  const mapped: MangaMultilingualChapter[] = [];

  for (
    let i = response.data.get_content_comicChapterRangeList.items.length - 1;
    i >= 0;
    i--
  ) {
    const x = response.data.get_content_comicChapterRangeList.items[i];
    mapped.push({
      index: i,
      date: new Date(x.chapterNodes[0].data.datePublic).toString(),
      language: x.chapterNodes[0].data.lang.substring(0, 2) as ISOLangCode,
      link: `https://${hostLink}${compressURL(x.chapterNodes[0].data.urlPath)}`,
      name: `Chapter ${x.serial}`,
      subname: x.chapterNodes[0].data.title,
    });
  }
  return mapped;
};
