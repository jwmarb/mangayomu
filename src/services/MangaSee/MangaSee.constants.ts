import { MangaHostFiltersInfo, MangaHostInfo } from '@services/scraper/scraper.interfaces';
import { createSchema } from '@utils/MangaFilters';

const MANGASEE_URL = 'https://mangasee123.com/';
const MANGASEE_GENRES = [
  'Action',
  'Adult',
  'Adventure',
  'Comedy',
  'Doujinshi',
  'Drama',
  'Ecchi',
  'Fantasy',
  'Gender Bender',
  'Harem',
  'Hentai',
  'Historical',
  'Horror',
  'Isekai',
  'Josei',
  'Lolicon',
  'Martial Arts',
  'Martial Arts  Shounen',
  'Mature',
  'Mecha',
  'Mystery',
  'Psychological',
  'Romance',
  'School Life',
  'Sci-fi',
  'Seinen',
  'Shotacon',
  'Shoujo',
  'Shoujo Ai',
  'Shounen',
  'Shounen Ai',
  'Slice of Life',
  'Smut',
  'Sports',
  'Supernatural',
  'Tragedy',
  'Yaoi',
  'Yuri',
] as const;

const filters = createSchema(({ createInclusiveExclusiveFilter, createOptionFilter, createSortFilter }) => ({
  'Official Translation': createOptionFilter({
    options: ['Any', 'Official Translation Only'],
    default: 'Any',
  }),
  'Scan Status': createOptionFilter({
    options: ['Any', 'Cancelled', 'Complete', 'Discontinued', 'Hiatus', 'Ongoing'],
    default: 'Any',
  }),
  'Publish Status': createOptionFilter({
    options: ['Any', 'Cancelled', 'Complete', 'Discontinued', 'Hiatus', 'Ongoing'],
    default: 'Any',
  }),
  Type: createOptionFilter({
    options: ['Any', 'Doujinshi', 'Manga', 'Manhua', 'Manhwa', 'OEL', 'One-shot'],
    default: 'Any',
  }),
  'Sort By': createSortFilter({
    options: [
      'Alphabetical A-Z',
      'Alphabetical Z-A',
      'Recently Released Chapter',
      'Year Released - Newest',
      'Year Released - Oldest',
      'Most Popular (All Time)',
      'Most Popular (Monthly)',
      'Least Popular',
    ],
    default: 'Alphabetical A-Z',
  }),
  Genres: createInclusiveExclusiveFilter({ fields: MANGASEE_GENRES }),
}));

export type MangaSeeFilter = typeof filters.schema;

export const MANGASEE_INFO: MangaHostFiltersInfo<typeof filters.schema> = {
  host: MANGASEE_URL,
  genres: MANGASEE_GENRES as any,
  name: 'MangaSee',
  icon: 'https://mangasee123.com/media/favicon.png',
  hasHotMangas: true,
  hasLatestMangas: true,
  hasMangaDirectory: true,
  filters,
};
