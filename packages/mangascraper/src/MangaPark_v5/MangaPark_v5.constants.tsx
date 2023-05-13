import { MangaHostFiltersInfo } from '../scraper/scraper.interfaces';
import createSchema from '@mangayomu/schema-creator';
import { GENRES } from './MangaPark_v5.helpers';

const MANGAPARKV5_GENRES = [
  '_4_koma',
  'action',
  'adaptation',
  'adult',
  'adventure',
  'age_gap',
  'aliens',
  'animals',
  'anthology',
  'artbook',
  'bara',
  'blackmail',
  'bloody',
  'brocon_siscon',
  'cars',
  'cartoon',
  'comedy',
  'comic',
  'cooking',
  'crime',
  'crossdressing',
  'cultivation',
  'death_game',
  'degeneratemc',
  'delinquents',
  'dementia',
  'demons',
  'doujinshi',
  'drama',
  'ecchi',
  'fan_colored',
  'fantasy',
  'fetish',
  'full_color',
  'futa',
  'game',
  'gender_bender',
  'genderswap',
  'ghosts',
  'gore',
  'gyaru',
  'harem',
  'harlequin',
  'hentai',
  'historical',
  'horror',
  'imageset',
  'incest',
  'isekai',
  'josei',
  'kids',
  'loli',
  'magic',
  'magical_girls',
  'manga',
  'manhua',
  'manhwa',
  'martial_arts',
  'master_servant',
  'mature',
  'mecha',
  'medical',
  'milf',
  'military',
  'monster_girls',
  'monsters',
  'music',
  'mystery',
  'netorare',
  'ninja',
  'office_workers',
  'omegaverse',
  'oneshot',
  'parody',
  'philosophical',
  'police',
  'post_apocalyptic',
  'psychological',
  'reincarnation',
  'reverse_harem',
  'romance',
  'samurai',
  'school_life',
  'sci_fi',
  'seinen',
  'shota',
  'shoujo',
  'shoujo_ai',
  'shounen',
  'shounen_ai',
  'showbiz',
  'slice_of_life',
  'sm_bdsm',
  'smut',
  'space',
  'sports',
  'step_family',
  'super_power',
  'superhero',
  'supernatural',
  'survival',
  'teacher_student',
  'thriller',
  'time_travel',
  'toomics',
  'traditional_games',
  'tragedy',
  'vampires',
  'video_games',
  'villainess',
  'violence',
  'virtual_reality',
  'web_comic',
  'webtoon',
  'western',
  'wuxia',
  'xianxia',
  'xuanhuan',
  'yaoi',
  'yuri',
  'zombies',
] as const;

const genresMappedToType = new Set([
  GENRES['Artbook'],
  GENRES['Cartoon'],
  GENRES['Comic'],
  GENRES['Doujinshi'],
  GENRES['Imageset'],
  GENRES['Manga'],
  GENRES['Manhua'],
  GENRES['Manhwa'],
  GENRES['Webtoon'],
  'western',
]);

const filters = createSchema(
  ({ createInclusiveExclusiveFilter, createOptionFilter }) => ({
    Type: createInclusiveExclusiveFilter({
      fields: [
        'Artbook',
        'Cartoon',
        'Comic',
        'Doujinshi',
        'Imageset',
        'Manga',
        'Manhua',
        'Manhwa',
        'Webtoon',
        'Western',
      ],
    }),
    'Original Work Language': createOptionFilter({
      options: ['Any', 'Chinese', 'English', 'Japanese', 'Korean'],
      default: 'Any',
    }),
    'Original Work Status': createOptionFilter({
      options: [
        'All',
        'Pending',
        'Ongoing',
        'Completed',
        'Hiatus',
        'Cancelled',
      ],
      default: 'All',
    }),
    'Number of Chapters': createOptionFilter({
      options: [
        'Any',
        '0',
        '1+',
        '10+',
        '20+',
        '30+',
        '40+',
        '50+',
        '60+',
        '70+',
        '80+',
        '90+',
        '100+',
        '200+',
        '300+',
        '200~299',
        '199~100',
        '99~90',
        '89~80',
        '79~70',
        '69~60',
        '59~50',
        '49~40',
        '39~30',
        '29~20',
        '19~10',
        '9~1',
      ],
      default: 'Any',
    }),
    'Order by': createOptionFilter({
      options: [
        'Rating Score',
        'Most Follows',
        'Most Reviews',
        'Most Comments',
        'Most Chapters',
        'Latest Upload',
        'Recently Created',
        'Name A-Z',
      ],
      default: 'Rating Score',
    }),
    Genres: createInclusiveExclusiveFilter({
      fields: MANGAPARKV5_GENRES.filter((x) => !genresMappedToType.has(x)),
      map: {
        gore: 'Gore',
        bara: 'Bara (ML)',
        josei: 'Josei',
        seinen: 'Seinen',
        shoujo: 'Shoujo',
        shounen: 'Shounen',
        yaoi: 'Yaoi (BL)',
        yuri: 'Yuri (GL)',
        futa: 'Futa (FL)',
        bloody: 'Bloody',
        violence: 'Violence',
        ecchi: 'Ecchi',
        adult: 'Adult',
        mature: 'Mature',
        smut: 'Smut',
        hentai: 'Hentai',
        _4_koma: '4-Koma',
        '4_koma': '4-Koma',
        web_comic: 'Web Comic',
        toomics: 'Toomics',
        action: 'Action',
        adaptation: 'Adaptation',
        adventure: 'Adventure',
        age_gap: 'Age Gap',
        aliens: 'Aliens',
        animals: 'Animals',
        anthology: 'Anthology',
        blackmail: 'Blackmail',
        brocon_siscon: 'Brocon/Siscon',
        cars: 'Cars',
        comedy: 'Comedy',
        cooking: 'Cooking',
        crime: 'Crime',
        crossdressing: 'Crossdressing',
        cultivation: 'Cultivation',
        death_game: 'Death Game',
        degeneratemc: 'DegenerateMC',
        delinquents: 'Delinquents',
        dementia: 'Dementia',
        demons: 'Demons',
        drama: 'Drama',
        fantasy: 'Fantasy',
        fan_colored: 'Fan-Colored',
        fetish: 'Fetish',
        full_color: 'Full Color',
        game: 'Game',
        gender_bender: 'Gender Bender',
        genderswap: 'Genderswap',
        ghosts: 'Ghosts',
        gyaru: 'Gyaru',
        harem: 'Harem',
        harlequin: 'Harlequin',
        historical: 'Historical',
        horror: 'Horror',
        incest: 'Incest',
        isekai: 'Isekai',
        kids: 'Kids',
        loli: 'Loli',
        magic: 'Magic',
        magical_girls: 'Magical Girls',
        martial_arts: 'Martial Arts',
        master_servant: 'Master-Servant',
        mecha: 'Mecha',
        medical: 'Medical',
        milf: 'MILF',
        military: 'Military',
        monster_girls: 'Monster Girls',
        monsters: 'Monsters',
        music: 'Music',
        mystery: 'Mystery',
        netorare: 'Netorare/NTR',
        ninja: 'Ninja',
        office_workers: 'Office Workers',
        omegaverse: 'Omegaverse',
        oneshot: 'Oneshot',
        parody: 'parody',
        philosophical: 'Philosophical',
        police: 'Police',
        post_apocalyptic: 'Post-Apocalyptic',
        psychological: 'Psychological',
        reincarnation: 'Reincarnation',
        reverse_harem: 'Reverse Harem',
        romance: 'Romance',
        samurai: 'Samurai',
        school_life: 'School Life',
        sci_fi: 'Sci-Fi',
        shota: 'Shota',
        shoujo_ai: 'Shoujo ai',
        shounen_ai: 'Shounen ai',
        showbiz: 'Showbiz',
        slice_of_life: 'Slice of Life',
        sm_bdsm: 'SM/BDSM',
        space: 'Space',
        sports: 'Sports',
        step_family: 'Step Family',
        super_power: 'Super Power',
        superhero: 'Superhero',
        supernatural: 'Supernatural',
        survival: 'Survival',
        teacher_student: 'Teacher-Student',
        thriller: 'Thriller',
        time_travel: 'Time Travel',
        traditional_games: 'Traditional Games',
        tragedy: 'Tragedy',
        vampires: 'Vampires',
        video_games: 'Video Games',
        villainess: 'Villainess',
        virtual_reality: 'Virtual Reality',
        wuxia: 'Wuxia',
        xianxia: 'Xianxia',
        xuanhuan: 'Xuanhuan',
        zombies: 'Zombies',
      },
    }),
  }),
);

export type MangaParkV5Filter = typeof filters.schema;

export const MANGAPARKV5_INFO: MangaHostFiltersInfo<MangaParkV5Filter> = {
  filters,
  isAdult: true,
  genres: MANGAPARKV5_GENRES as any,
  hasHotMangas: true,
  hasLatestMangas: true,
  hasMangaDirectory: false,
  host: 'https://mangapark.net/',
  version: '1.1.2',
  name: 'MangaPark v3',
  icon: 'https://mangapark.io/client-script/img/favicon.gif',
};
