import {
  Manga,
  MangaChapter,
  MangaMultilingualChapter,
  WithAuthors,
  WithHentai,
  WithRating,
  WithStatus,
} from '@mangayomu/mangascraper/src';
import Realm from 'realm';
import React from 'react';
import useMangaSource from '@hooks/useMangaSource';
import { InteractionManager } from 'react-native';
import { getErrorMessage } from '@helpers/getErrorMessage';
import { useObject, useRealm, useLocalRealm } from '../../main';
import { ChapterSchema } from '@database/schemas/Chapter';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import displayMessage from '@helpers/displayMessage';
import integrateSortedList from '@helpers/integrateSortedList';
import NetInfo from '@react-native-community/netinfo';
import { useUser } from '@realm/react';
import {
  ImageScaling,
  ReaderScreenOrientation,
  ReadingDirection,
  ZoomStartPosition,
} from '@redux/slices/settings';
import assertIsManga from '@helpers/assertIsManga';

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
};

export const KEYS_OF_SORT_CHAPTERS_BY = Object.keys(
  SORT_CHAPTERS_BY,
) as readonly SortChaptersMethod[];

export type SortChaptersMethod = keyof typeof SORT_CHAPTERS_BY;

export interface IMangaSchema
  extends Omit<Manga, 'link'>,
    Partial<WithAuthors>,
    Partial<WithStatus>,
    Partial<WithHentai>,
    Partial<WithRating> {
  description: string | null;
  genres: Set<string>;
  chapters: string[];
  sortChaptersBy: SortChaptersMethod;
  reversedSort: boolean;
  currentlyReadingChapter?: CurrentlyReadingChapter;
  dateAddedInLibrary?: number;
  notifyNewChaptersCount?: number;
  inLibrary: boolean;
  selectedLanguage: ISOLangCode | 'Use default language';
  availableLanguages: ISOLangCode[];
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
  description!: string | null;
  genres!: Set<string>;
  currentlyReadingChapter?: CurrentlyReadingChapter;
  dateAddedInLibrary?: number;
  notifyNewChaptersCount!: number;
  chapters!: string[];
  sortChaptersBy!: keyof typeof SORT_CHAPTERS_BY;
  inLibrary!: boolean;
  authors?: string[];
  isHentai?: boolean;
  rating?: WithRating['rating'];
  status?: WithStatus['status'];
  reversedSort!: boolean;
  selectedLanguage!: ISOLangCode | 'Use default language';
  availableLanguages!: ISOLangCode[];
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
      description: 'mixed',
      genres: 'string<>',
      currentlyReadingChapter: 'MangaReadingChapter?',
      dateAddedInLibrary: 'int?',
      notifyNewChaptersCount: { type: 'int?', default: 0 },
      chapters: 'string[]',
      sortChaptersBy: { type: 'string', default: 'Chapter number' },
      authors: { type: 'string[]', default: [] },
      isHentai: { type: 'bool', default: false },
      rating: 'MangaRating?',
      inLibrary: { type: 'bool', default: false },
      status: 'MangaStatus?',
      reversedSort: { type: 'bool', default: true },
      selectedLanguage: { type: 'string', default: 'Use default language' },
      availableLanguages: 'string[]',
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

export type FetchMangaMetaStatus = 'loading' | 'success' | 'local' | 'error';

export const SortLanguages = (a: ISOLangCode, b: ISOLangCode) =>
  languages[a].name.localeCompare(languages[b].name);

function deepEqual(
  a: Omit<MangaChapter, 'link'>,
  b: Omit<MangaChapter, 'link'>,
) {
  return a.date === b.date && a.index === b.index && a.name === b.name;
}

export const useManga = (
  link: string | Manga | MangaSchema,
  options: UseMangaOptions = { preferLocal: true },
) => {
  const mangaRealm = useRealm();
  const localRealm = useLocalRealm();
  const currentUser = useUser();
  if (currentUser == null)
    throw Error('currentUser is null in useManga() when it is required.');
  const mangaId =
    typeof link === 'string'
      ? link
      : assertIsManga(link)
      ? link.link
      : link._id;

  const [isOffline, setIsOffline] = React.useState<boolean | null>(null);
  const [status, setStatus] = React.useState<FetchMangaMetaStatus>(
    options.preferLocal ? 'local' : 'loading',
  );
  const [error, setError] = React.useState<string>('');
  const [manga, setManga] = React.useState<MangaSchema | undefined>(
    mangaRealm.objectForPrimaryKey(MangaSchema, mangaId),
  );
  React.useEffect(() => {
    const callback: Realm.CollectionChangeCallback<MangaSchema> = (
      collection,
      mods,
    ) => {
      for (const key in mods) {
        if (mods[key as keyof typeof mods].length > 0) {
          for (const index of mods[key as keyof typeof mods]) {
            if (collection[index]._id === mangaId) setManga(collection[index]);
          }
        }
      }
    };
    const listener = mangaRealm.objects(MangaSchema);
    listener?.addListener(callback);
    return () => {
      listener?.removeListener(callback);
    };
  }, []);
  React.useEffect(() => {
    const netListener = NetInfo.addEventListener((state) => {
      setIsOffline(state.isInternetReachable === false);
      if (state.isInternetReachable === false)
        setStatus((prevStatus) =>
          prevStatus === 'loading' ? 'error' : 'local',
        );
    });
    return () => {
      netListener();
    };
  }, []);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      if (isOffline === false) {
        try {
          await fetchData();
          setStatus('success');
        } catch (e) {
          setStatus('error');
          setError(e as string);
        }
      }
    });
  }, [isOffline]);
  const source = typeof link !== 'string' ? useMangaSource(link) : null;

  const fetchData = React.useCallback(async () => {
    if (!options.preferLocal) {
      if (isOffline) {
        displayMessage('You are offline.');
        return;
      }
      if (typeof link === 'string')
        throw Error(
          `"${link}" does not exist in the realm and is being called upon when it is undefined. Use type Manga instead of type string.`,
        );
      if (source == null)
        throw Error(
          `"${
            link.source
          }" is not a valid source. Cannot fetch manga metadata from ${
            assertIsManga(link) ? link.link : link._id
          }.`,
        );
      const _manga = link;
      setStatus('loading');
      setError('');
      try {
        const meta = await source.getMeta(
          assertIsManga(_manga)
            ? _manga
            : {
                link: _manga._id,
                imageCover: _manga.imageCover,
                title: _manga.title,
                source: _manga.source,
              },
        );
        const chapters: string[] = [];
        const availableLanguages: ISOLangCode[] = [];
        const lookup = new Set<string>();
        localRealm.write(() => {
          for (const x of meta.chapters) {
            chapters.push(x.link);
            if ('language' in x) {
              const multilingualChapter = x as MangaMultilingualChapter;
              if (!lookup.has(multilingualChapter.language)) {
                integrateSortedList(availableLanguages, SortLanguages).add(
                  multilingualChapter.language,
                );
                lookup.add(multilingualChapter.language);
              }
            } else if (!lookup.has('en')) {
              availableLanguages.push('en');
              lookup.add('en');
            }
            const existingChapter = localRealm.objectForPrimaryKey(
              ChapterSchema,
              x.link,
            );
            if (
              (existingChapter != null && !deepEqual(existingChapter, x)) ||
              existingChapter == null
            ) {
              const copy = x;
              (copy as unknown as ChapterSchema)._mangaId = meta.link;
              (copy as unknown as ChapterSchema)._id = x.link;
              (copy as unknown as ChapterSchema)._realmId = currentUser.id;
              (copy as unknown as ChapterSchema).language =
                (x as MangaMultilingualChapter).language ?? 'en';
              delete (copy as Partial<MangaChapter>).link;
              localRealm.create<ChapterSchema>(
                ChapterSchema,
                copy,
                Realm.UpdateMode.Modified,
              );
            }
          }
        });
        mangaRealm.write(() => {
          mangaRealm.create<MangaSchema>(
            'Manga',
            {
              ...meta,
              _id: meta.link,
              _realmId: currentUser.id,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              genres: meta.genres as unknown as Set<string>,
              chapters,
              availableLanguages,
              readerDirection: meta.genres.some((genre) => {
                const formatted = genre.toLowerCase();
                return (
                  formatted === 'manhwa' ||
                  formatted === 'manhua' ||
                  formatted === 'webtoon'
                );
              })
                ? ReadingDirection.WEBTOON
                : manga?.readerDirection ?? 'Use global setting',
              notifyNewChaptersCount: 0,
            },
            Realm.UpdateMode.Modified,
          );
        });
      } catch (e) {
        console.error(e);
        throw Error(getErrorMessage(e));
      }
    }
  }, [
    options.preferLocal,
    link,
    setStatus,
    setError,
    source,
    mangaRealm,
    manga,
    isOffline,
    localRealm,
  ]);

  const refresh = React.useCallback(async () => {
    if (manga != null) {
      try {
        await fetchData();
        setStatus('success');
      } catch (e) {
        setStatus('error');
        setError(e as string);
      }
    }
  }, [fetchData, manga == null]);

  const update = React.useCallback(
    (
      fn: (
        mangaRealmObject: MangaSchema,
        getChapter: (key: string) => ChapterSchema | null,
      ) => void,
    ) => {
      if (manga != null && manga.isValid()) {
        mangaRealm.write(() => {
          fn(manga, (k: string) =>
            localRealm.objectForPrimaryKey<ChapterSchema>('Chapter', k),
          );
        });
      }
    },
    [manga, mangaRealm, localRealm],
  );

  return { manga, refresh, status, error, update };
};
