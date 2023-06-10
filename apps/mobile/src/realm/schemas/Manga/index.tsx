import {
  Manga,
  MangaChapter,
  MangaMultilingualChapter,
  WithAuthors,
  WithHentai,
  WithRating,
  WithStatus,
} from '@mangayomu/mangascraper';
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
  'Chapter number': (a: MangaChapter) => {
    if (a.name) {
      const aName = a.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
      if (aName != null) return parseFloat(aName[0]);
    }
    if (a.index != null) return a.index;
    throw Error('Chapter cannot be sorted due to undefined name and index');
  },
  Timestamp: (a: MangaChapter) => Date.parse(a.date),
};

export const SORT_CHAPTERS_BY_LEGACY = {
  'Chapter number': (a: MangaChapter, b: MangaChapter) => {
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
  extends Omit<Manga, 'index'>,
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
  link!: string;
  title!: string;
  imageCover!: string;
  index!: number;
  source!: string;
  description!: string | null;
  genres!: Set<string>;
  currentlyReadingChapter!: CurrentlyReadingChapter;
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
      link: 'string',
      index: 'int',
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

export const useManga = (
  link: string | Omit<Manga, 'index'>,
  options: UseMangaOptions = { preferLocal: true },
) => {
  const mangaRealm = useRealm();
  const cloudRealm = useLocalRealm();
  const currentUser = useUser();
  if (currentUser == null)
    throw Error('currentUser is null in useManga() when it is required.');
  const [isOffline, setIsOffline] = React.useState<boolean | null>(null);
  const [status, setStatus] = React.useState<FetchMangaMetaStatus>(
    options.preferLocal ? 'local' : 'loading',
  );
  const [error, setError] = React.useState<string>('');
  const mangaObject = useObject(
    MangaSchema,
    typeof link === 'string' ? link : link.link,
  );

  const [manga, setManga] = React.useState<IMangaSchema | undefined>(
    mangaObject && mangaObject.isValid() ? mangaObject : undefined,
  );
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
          `"${link.source}" is not a valid source. Cannot fetch manga metadata from ${link.link}.`,
        );
      const manga = link as Manga;
      setStatus('loading');
      setError('');
      try {
        const meta = await source.getMeta(manga);
        cloudRealm.write(() => {
          for (const x of meta.chapters) {
            const copy = x;
            (copy as ChapterSchema)._mangaId = meta.link;
            (copy as ChapterSchema)._id = x.link;
            (copy as ChapterSchema)._realmId = currentUser.id;
            (copy as ChapterSchema).language =
              (x as MangaMultilingualChapter).language ?? 'en';

            cloudRealm.create<ChapterSchema>(
              'Chapter',
              copy,
              Realm.UpdateMode.Modified,
            );
          }
        });
        mangaRealm.write(() => {
          const { chapters, availableLanguages } = meta.chapters.reduce(
            (prev, curr) => {
              prev.chapters.push(curr.link);
              const { add } = integrateSortedList(
                prev.availableLanguages,
                SortLanguages,
              );
              if ('language' in curr) {
                const multilingualChapter = curr as MangaMultilingualChapter;
                if (!prev.__memo__.has(multilingualChapter.language)) {
                  add(multilingualChapter.language);
                  prev.__memo__.add(multilingualChapter.language);
                }
              } else if (!prev.__memo__.has('en')) {
                add('en');
                prev.__memo__.add('en');
              }
              return prev;
            },
            {
              chapters: [] as string[],
              availableLanguages: [] as ISOLangCode[],
              __memo__: new Set<ISOLangCode>(),
            },
          );
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
                : mangaObject?.readerDirection ?? 'Use global setting',
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
    mangaObject,
    isOffline,
    cloudRealm,
  ]);

  const refresh = React.useCallback(async () => {
    if (mangaObject != null) {
      try {
        await fetchData();
        setStatus('success');
      } catch (e) {
        setStatus('error');
        setError(e as string);
      }
    }
  }, [fetchData, mangaObject == null]);

  // useMountEffect(() => {
  //   InteractionManager.runAfterInteractions(async () => {
  //     try {
  //       await fetchData();
  //       setStatus('success');
  //     } catch (e) {
  //       setStatus('error');
  //       setError(e as string);
  //     }
  //   });
  // }, []);
  React.useEffect(() => {
    mangaObject?.addListener((_manga, changes) => {
      if (changes.deleted) setManga(undefined);
      else setManga(_manga);
    });
    return () => {
      mangaObject?.removeAllListeners();
    };
  }, [mangaObject != null]);

  const update = React.useCallback(
    (
      fn: (
        mangaRealmObject: MangaSchema & Realm.Object<MangaSchema, never>,
        getChapter: (key: string) => ChapterSchema | null,
      ) => void,
    ) => {
      if (mangaObject != null && mangaObject.isValid()) {
        mangaRealm.write(() => {
          fn(mangaObject, (k: string) =>
            cloudRealm.objectForPrimaryKey<ChapterSchema>('Chapter', k),
          );
        });
      }
    },
    [mangaObject, mangaRealm, cloudRealm],
  );

  return { manga, refresh, status, error, update };
};
