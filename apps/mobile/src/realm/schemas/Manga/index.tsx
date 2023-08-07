import {
  Manga,
  MangaChapter,
  WithAuthors,
  WithHentai,
  WithRating,
  WithStatus,
} from '@mangayomu/mangascraper/src';
import Realm from 'realm';
import React from 'react';
import { getErrorMessage } from '@helpers/getErrorMessage';
import { useLocalRealm, useRealm } from '../../main';
import { ChapterSchema } from '@database/schemas/Chapter';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import {
  ImageScaling,
  ReaderScreenOrientation,
  ReadingDirection,
  ZoomStartPosition,
} from '@redux/slices/settings';
import assertIsManga from '@helpers/assertIsManga';
import useMangaListener from '@database/schemas/Manga/useMangaListener';
import useFetchManga from '@database/schemas/Manga/useFetchManga';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import { useUser } from '@realm/react';
import useCombinedMangaWithLocal, {
  CombinedMangaWithLocal,
} from '@hooks/useCombinedMangaWithLocal';
import {
  CurrentlyReadingChapter,
  IMangaSchema,
  RequiredMangaSchemaFields,
  SORT_CHAPTERS_BY,
  SortChaptersBy,
} from '@mangayomu/schemas';

export const MangaRatingSchema: Realm.ObjectSchema = {
  name: 'MangaRating',
  embedded: true,
  properties: {
    value: 'mixed',
    voteCount: 'int',
  },
};

export const MangaStatusSchema: Realm.ObjectSchema = {
  name: 'MangaStatus',
  embedded: true,
  properties: {
    scan: 'string?',
    publish: 'string?',
  },
};

export const MangaReadingChapter: Realm.ObjectSchema = {
  name: 'MangaReadingChapter',
  embedded: true,
  properties: {
    _id: 'string',
    index: 'int',
    numOfPages: 'int',
  },
};

export const SORT_CHAPTERS_BY_LEGACY = {
  'Chapter number': (
    a: Omit<MangaChapter, 'link'>,
    b: Omit<MangaChapter, 'link'>,
  ) => {
    if (a.name && b.name) {
      const aName = a.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
      const bName = b.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
      if (aName != null && bName != null)
        return parseFloat(bName[0]) - parseFloat(aName[0]);
    }
    if (a.index != null && b.index != null) return b.index - a.index;
    throw Error('Chapter cannot be sorted due to undefined name and index');
  },
  Timestamp: (a: Omit<MangaChapter, 'link'>, b: Omit<MangaChapter, 'link'>) =>
    Date.parse(a.date) - Date.parse(b.date),
};

export const KEYS_OF_SORT_CHAPTERS_BY = Object.keys(
  SORT_CHAPTERS_BY,
) as readonly SortChaptersBy[];

export class MangaSchema extends Realm.Object<
  IMangaSchema,
  RequiredMangaSchemaFields
> {
  title!: string;
  imageCover!: string;
  source!: string;
  currentlyReadingChapter?: CurrentlyReadingChapter;
  dateAddedInLibrary?: number;
  notifyNewChaptersCount!: number;
  link!: string;
  inLibrary!: boolean;
  selectedLanguage!: ISOLangCode | 'Use default language';
  readerDirection!: ReadingDirection | 'Use global setting';
  readerZoomStartPosition!: ZoomStartPosition | 'Use global setting';
  readerImageScaling!: ImageScaling | 'Use global setting';
  readerLockOrientation!: ReaderScreenOrientation | 'Use global setting';
  _id!: Realm.BSON.ObjectId;
  _realmId!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Manga',
    properties: {
      _id: {
        type: 'objectId',
        default: () => new Realm.BSON.ObjectID(),
      },
      link: {
        type: 'string',
        indexed: true,
      },
      _realmId: 'string',
      title: 'string',
      imageCover: 'string',
      source: 'string',
      currentlyReadingChapter: 'MangaReadingChapter?',
      dateAddedInLibrary: 'int?',
      notifyNewChaptersCount: { type: 'int?', default: 0 },

      inLibrary: { type: 'bool', default: false },
      selectedLanguage: { type: 'string', default: 'Use default language' },
      readerDirection: { type: 'string', default: 'Use global setting' },
      readerZoomStartPosition: {
        type: 'string',
        default: 'Use global setting',
      },
      readerLockOrientation: { type: 'string', default: 'Use global setting' }, // mobile property only
      readerImageScaling: { type: 'string', default: 'Use global setting' },
    },
    primaryKey: '_id',
  };
}

export type UseMangaOptions = {
  preferLocal?: boolean;
  preferredLanguage?: ISOLangCode;
};

export const SortLanguages = (a: ISOLangCode, b: ISOLangCode) =>
  languages[a].name.localeCompare(languages[b].name);

export const useManga = (
  link: string | Manga | MangaSchema,
  options: UseMangaOptions = { preferLocal: true },
) => {
  const realm = useRealm();
  const user = useUser();
  const mangaId = typeof link === 'string' ? link : link.link;

  const { state, setState, fetchData } = useFetchManga(options, link);
  const combinedManga = useCombinedMangaWithLocal(mangaId);

  const refresh = React.useCallback(async () => {
    if (combinedManga != null) {
      try {
        await fetchData();
        setState({
          status: 'success',
        });
      } catch (e) {
        setState({
          error: getErrorMessage(e),
          status: 'error',
        });
      }
    }
  }, [fetchData, combinedManga == null, setState]);

  const update = React.useCallback(
    (
      fn: (
        mangaRealmObject: Omit<CombinedMangaWithLocal, 'update'>,
        getChapter: (key: string) => ChapterSchema | null,
      ) => void,
    ) => {
      if (combinedManga != null) {
        combinedManga.update((draft) =>
          fn(draft, (k: string) =>
            realm.objectForPrimaryKey<ChapterSchema>('Chapter', k),
          ),
        );
      }
      // if (combinedManga == null && combinedManga != null) {
      //   realm.write(() => {
      //     fn(combinedManga, (k: string) =>
      //       realm.objectForPrimaryKey<ChapterSchema>('Chapter', k),
      //     );
      //     realm.create(MangaSchema, p);
      //   });
      // } else if (manga?.isValid()) {
      // realm.write(() => {
      //   fn(manga, (k: string) =>
      //     realm.objectForPrimaryKey<ChapterSchema>('Chapter', k),
      //   );
      // });
      // }
    },
    [combinedManga, realm, user],
  );

  return {
    manga: combinedManga,
    refresh,
    status: state.status,
    error: state.error,
    update,
  };
};
