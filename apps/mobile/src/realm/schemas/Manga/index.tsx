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
    index: 'double',
    numOfPages: 'int',
  },
};

export type CurrentlyReadingChapter = {
  _id: string;
  index: number;
  numOfPages: number;
};

export const SORT_CHAPTERS_BY = {
  'Chapter number': (a: Omit<MangaChapter, 'link'>) => {
    if (a.name) {
      const aName = a.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
      if (aName != null) return parseFloat(aName[0]);
    }
    if (a.index != null) return a.index;
    throw Error('Chapter cannot be sorted due to undefined name and index');
  },
  Timestamp: (a: Omit<MangaChapter, 'link'>) => Date.parse(a.date),
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
) as readonly SortChaptersMethod[];

export type SortChaptersMethod = keyof typeof SORT_CHAPTERS_BY;

export interface IMangaSchema extends Omit<Manga, 'link'> {
  sortChaptersBy: SortChaptersMethod;
  reversedSort: boolean;
  currentlyReadingChapter?: CurrentlyReadingChapter;
  dateAddedInLibrary?: number;
  notifyNewChaptersCount?: number;
  inLibrary: boolean;
  selectedLanguage: ISOLangCode | 'Use default language';
  readerDirection: ReadingDirection | 'Use global setting';
  readerZoomStartPosition: ZoomStartPosition | 'Use global setting';
  readerImageScaling: ImageScaling | 'Use global setting';
  readerLockOrientation: ReaderScreenOrientation | 'Use global setting';
  _id: string;
  _realmId: string;
}

export class MangaSchema extends Realm.Object<IMangaSchema> {
  title!: string;
  imageCover!: string;
  source!: string;
  currentlyReadingChapter?: CurrentlyReadingChapter;
  dateAddedInLibrary?: number;
  notifyNewChaptersCount!: number;

  inLibrary!: boolean;
  selectedLanguage!: ISOLangCode | 'Use default language';
  readerDirection!: ReadingDirection | 'Use global setting';
  readerZoomStartPosition!: ZoomStartPosition | 'Use global setting';
  readerImageScaling!: ImageScaling | 'Use global setting';
  readerLockOrientation!: ReaderScreenOrientation | 'Use global setting';
  _id!: string;
  _realmId!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Manga',
    properties: {
      _id: 'string',
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
  const localRealm = useLocalRealm();
  const user = useUser();
  const mangaId =
    typeof link === 'string'
      ? link
      : assertIsManga(link)
      ? link.link
      : link._id;

  const { state, setState, fetchData } = useFetchManga(options, link);
  const { manga, meta } = useMangaListener(mangaId);

  const refresh = React.useCallback(async () => {
    if (manga != null) {
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
  }, [fetchData, manga == null, setState]);

  const update = React.useCallback(
    (
      fn: (
        mangaRealmObject: MangaSchema,
        getChapter: (key: string) => ChapterSchema | null,
      ) => void,
    ) => {
      if (manga == null && meta != null) {
        realm.write(() => {
          const p: MangaSchema = {
            _id: meta._id,
            _realmId: user.id,
            title: meta.title,
            imageCover: meta.imageCover,
            source: meta.source,
          } as unknown as MangaSchema;
          fn(p, (k: string) =>
            realm.objectForPrimaryKey<ChapterSchema>('Chapter', k),
          );
          realm.create(MangaSchema, p);
        });
      } else if (manga?.isValid()) {
        realm.write(() => {
          fn(manga, (k: string) =>
            realm.objectForPrimaryKey<ChapterSchema>('Chapter', k),
          );
        });
      }
    },
    [manga, realm, meta, user],
  );

  const updateLocal = React.useCallback(
    (
      fn: (
        mangaRealmObject: LocalMangaSchema,
        getChapter: (key: string) => ChapterSchema | null,
      ) => void,
    ) => {
      if (meta != null && meta.isValid()) {
        localRealm.write(() => {
          fn(meta, (k: string) =>
            realm.objectForPrimaryKey<ChapterSchema>('Chapter', k),
          );
        });
      }
    },
    [meta, localRealm],
  );

  return {
    manga,
    meta,
    refresh,
    status: state.status,
    error: state.error,
    update,
    updateLocal,
  };
};
