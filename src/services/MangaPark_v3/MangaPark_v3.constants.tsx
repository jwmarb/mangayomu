import { MangaHostFiltersInfo } from '@services/scraper/scraper.interfaces';
import { createSchema } from '@utils/MangaFilters';
import { Typography } from '@components/Typography';

const MANGAPARKV3_GENRES = [
  '4-Koma',
  'Action',
  'Adaptation',
  'Adult',
  'Adventure',
  'Aliens',
  'Animals',
  'Anthology',
  'Bloody',
  'Comedy',
  'Cooking',
  'Crossdressing',
  'Cultivation',
  'Delinquents',
  'Dementia',
  'Demons',
  'Drama',
  'Ecchi',
  'Fan-Colored',
  'Fantasy',
  'Full Color',
  'Game',
  'Gender Bender',
  'Genderswap',
  'Ghosts',
  'Gore',
  'Gyaru',
  'Harem',
  'Hentai',
  'Historical',
  'Horror',
  'Incest',
  'Isekai',
  'Josei',
  'Kids',
  'Loli',
  'Magic',
  'Magical Girls',
  'Martial Arts',
  'Mature',
  'Mecha',
  'Medical',
  'Military',
  'Monster Girls',
  'Monsters',
  'Music',
  'Mystery',
  'Netorare/NTR',
  'Ninja',
  'Office Workers',
  'Oneshot',
  'Philosophical',
  'Police',
  'Post-Apocalyptic',
  'Psychological',
  'Reincarnation',
  'Reverse Harem',
  'Romance',
  'SM/BDSM',
  'Samurai',
  'School Life',
  'Sci-Fi',
  'Seinen',
  'Shota',
  'Shoujo',
  'Shoujo ai',
  'Shounen',
  'Shounen ai',
  'Slice of Life',
  'Smut',
  'Space',
  'Sports',
  'Super Power',
  'Superhero',
  'Supernatural',
  'Survival',
  'Thriller',
  'Time Travel',
  'Traditional Games',
  'Tragedy',
  'Vampires',
  'Video Games',
  'Villainess',
  'Violence',
  'Virtual Reality',
  'Wuxia',
  'Xianxia',
  'Xuanhuan',
  'Yaoi',
  'Yuri',
  'Zombies',
  'Cars',
  'Crime',
  'Parody',
] as const;

const filters = createSchema(
  ({ createInclusiveExclusiveFilter, createOptionFilter, createSortFilter, createDescription }) => ({
    description: createDescription(
      <Typography color='textSecondary'>
        <Typography bold color='secondary'>
          NOTE:
        </Typography>{' '}
        Text search is ignored whenever filters are applied!
      </Typography>
    ),
    Type: createInclusiveExclusiveFilter({
      fields: ['Artbook', 'Cartoon', 'Comic', 'Doujinshi', 'Imageset', 'Manga', 'Manhuwa', 'Manhwa', 'Webtoon'],
    }),
    'Original Language': createOptionFilter({
      options: ['Any', 'Chinese', 'English', 'Japanese', 'Korean'],
      default: 'Any',
    }),
    Status: createOptionFilter({
      options: ['All', 'Pending', 'Ongoing', 'Completed', 'Hiatus', 'Cancelled'],
      default: 'All',
    }),
    Chapters: createOptionFilter({
      options: ['All', '1 ~ 9', '10 ~ 29', '30 ~ 99', '100 ~ 199', '200+', ' 100+', '50+', '10+', '1+'],
      default: 'All',
    }),
    'Order by': createSortFilter({
      options: ['Rating', 'Comments', 'Discuss', 'Update', 'Create', 'Name'],
      default: 'Rating',
    }),
    Genres: createInclusiveExclusiveFilter({ fields: MANGAPARKV3_GENRES }),
  })
);

export type MangaParkV3Filter = typeof filters.schema;

export const MANGAPARKV3_INFO: MangaHostFiltersInfo<MangaParkV3Filter> = {
  filters,
  genres: MANGAPARKV3_GENRES as any,
  hasHotMangas: false,
  hasLatestMangas: false,
  hasMangaDirectory: false,
  host: 'https://mangapark.net/',
  version: '1.0.0',
  name: 'MangaPark v3',
  icon: 'https://styles.amarkcdn.com/img/mpark/favicon.ico?v1',
};
