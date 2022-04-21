import { Manga, WithDate, WithGenres, WithStatus, WithYearReleased } from '@services/scraper/scraper.interfaces';
import { NumberComparator, StringComparator } from '@utils/Algorithms';
import { Comparator } from '@utils/Algorithms/Comparator/Comparator.interfaces';

const sort = {
  'A-Z': (a: Manga, b: Manga) => a.title.localeCompare(b.title),
  'Release Date': (a: WithDate, b: WithDate) => Date.parse(a.date) - Date.parse(b.date),
  'Year Released': (a: WithYearReleased, b: WithYearReleased) => parseInt(a.yearReleased) - parseInt(b.yearReleased),
};

export type SortType = keyof typeof sort;
