import { MangaChapter } from './scraper.interfaces';

export function toPascalCase(input: string) {
  return input
    .trim()
    .split(/\s|-|_/g)
    .map((x) => x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase())
    .join(' ')
    .trim();
}

export function sortChapters(x: MangaChapter[]) {
  x.sort((a, b) => {
    if (
      'language' in a &&
      'language' in b &&
      typeof a.language === 'string' &&
      typeof b.language === 'string'
    ) {
      if (a.language === b.language) return a.index - b.index;
      return a.language.localeCompare(b.language);
    }
    return a.index - b.index;
  });
  for (let i = 0; i < x.length; i++) {
    x[i].index = i;
  }
}
