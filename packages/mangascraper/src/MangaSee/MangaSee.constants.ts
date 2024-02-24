/* eslint-disable @typescript-eslint/no-explicit-any */
import { MangaHostFiltersInfo } from '../scraper/scraper.interfaces';
import createSchema from '@mangayomu/schema-creator';

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

const filters = createSchema(
  ({
    createInclusiveExclusiveFilter,
    createOptionFilter,
    createSortFilter,
  }) => ({
    'Official Translation': createOptionFilter({
      options: ['Any', 'Official Translation Only'],
      default: 'Any',
    }),
    'Scan Status': createOptionFilter({
      options: [
        'Any',
        'Cancelled',
        'Complete',
        'Discontinued',
        'Hiatus',
        'Ongoing',
      ],
      default: 'Any',
    }),
    'Publish Status': createOptionFilter({
      options: [
        'Any',
        'Cancelled',
        'Complete',
        'Discontinued',
        'Hiatus',
        'Ongoing',
      ],
      default: 'Any',
    }),
    Type: createOptionFilter({
      options: [
        'Any',
        'Doujinshi',
        'Manga',
        'Manhua',
        'Manhwa',
        'OEL',
        'One-shot',
      ],
      default: 'Any',
    }),
    'Sort By': createSortFilter({
      options: [
        'Alphabetical',
        'Popularity (All Time)',
        'Popularity (Monthly)',
        'Recently Released Chapter',
        'Year Released',
      ],
      default: 'Alphabetical',
    }),
    Genres: createInclusiveExclusiveFilter({ fields: MANGASEE_GENRES }),
  }),
);

export type MangaSeeFilter = typeof filters.schema;

export const MANGASEE_INFO: MangaHostFiltersInfo<typeof filters.schema> = {
  language: 'en',
  host: MANGASEE_URL,
  containsNSFW: false,
  genres: MANGASEE_GENRES as any,
  version: '1.1.0',
  name: 'MangaSee',
  icon: 'https://mangasee123.com/media/favicon.png',
  hasTrendingMangas: true,
  hasLatestMangas: true,
  hasMangaDirectory: true,
  filters,
};
