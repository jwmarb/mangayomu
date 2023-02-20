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
import { useObject, useRealm } from '../../main';
import { ChapterSchema } from '@database/schemas/Chapter';
import useMountEffect from '@hooks/useMountEffect';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import displayMessage from '@helpers/displayMessage';
import integrateSortedList from '@helpers/integrateSortedList';

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
  currentlyReadingChapter?: string;
  dateAddedInLibrary?: Date;
  notifyNewChaptersCount?: number;
  chapters: string[];
  sortChaptersBy: SortChaptersMethod;
  reversedSort: boolean;
  inLibrary: boolean;
  selectedLanguage: ISOLangCode | 'Use default language';
  availableLanguages: ISOLangCode[];
}

export class MangaSchema extends Realm.Object<IMangaSchema> {
  link!: string;
  title!: string;
  imageCover!: string;
  index!: number;
  source!: string;
  description!: string | null;
  genres!: Set<string>;
  currentlyReadingChapter!: string;
  dateAddedInLibrary?: Date;
  modifyNewChaptersCount!: number;
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

  static schema: Realm.ObjectSchema = {
    name: 'Manga',
    properties: {
      link: 'string',
      index: 'int',
      title: 'string',
      imageCover: 'string',
      source: 'string',
      description: 'mixed',
      genres: 'string<>',
      currentlyReadingChapter: 'string?',
      dateAddedInLibrary: 'date?',
      notifyNewChaptersCount: { type: 'int?', default: 0 },
      chapters: 'string[]',
      sortChaptersBy: { type: 'string', default: 'Chapter number' },
      authors: { type: 'string?[]', default: [] },
      isHentai: { type: 'bool', default: false },
      rating: 'MangaRating?',
      inLibrary: { type: 'bool', default: false },
      status: 'MangaStatus?',
      reversedSort: { type: 'bool', default: true },
      selectedLanguage: { type: 'string', default: 'Use default language' },
      availableLanguages: 'string[]',
    },
    primaryKey: 'link',
  };
}

export type UseMangaOptions = {
  preferLocal?: boolean;
  preferredLanguage?: ISOLangCode;
};

export type FetchMangaMetaStatus = 'loading' | 'success' | 'local' | 'error';

const SortLanguages = (a: ISOLangCode, b: ISOLangCode) =>
  languages[a].name.localeCompare(languages[b].name);

export const useManga = (
  link: string | Omit<Manga, 'index'>,
  options: UseMangaOptions = { preferLocal: true },
) => {
  const [manga, setManga] = React.useState<IMangaSchema>();
  const [status, setStatus] = React.useState<FetchMangaMetaStatus>(
    options.preferLocal ? 'local' : 'loading',
  );
  const [error, setError] = React.useState<string>('');
  const mangaObject = useObject(
    MangaSchema,
    typeof link === 'string' ? link : link.link,
  );
  const source = typeof link !== 'string' ? useMangaSource(link) : null;
  const mangaRealm = useRealm();

  const fetchData = React.useCallback(async () => {
    if (!options.preferLocal) {
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
              genres: meta.genres as unknown as Set<string>,
              chapters,
              availableLanguages,
              modifyNewChaptersCount: mangaObject
                ? mangaObject.modifyNewChaptersCount +
                  (meta.chapters.length - mangaObject.chapters.length)
                : 0,
            },
            Realm.UpdateMode.Modified,
          );

          for (const x of meta.chapters) {
            const copy = x;
            (copy as ChapterSchema).manga = manga.link;
            mangaRealm.create<ChapterSchema>(
              'Chapter',
              copy,
              Realm.UpdateMode.Modified,
            );
          }
        });
      } catch (e) {
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

  useMountEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      try {
        await fetchData();
        setStatus('success');
      } catch (e) {
        setStatus('error');
        setError(e as string);
      }
    });
  }, []);
  React.useEffect(() => {
    mangaObject?.addListener((_manga, changes) => {
      if (changes.deleted) setManga(undefined);
      else setManga(_manga);
    });
    return () => {
      mangaObject?.removeAllListeners();
    };
  }, [mangaObject == null]);

  const update = React.useCallback(
    (
      fn: (
        mangaRealmObject: MangaSchema & Realm.Object<MangaSchema, never>,
        getChapter: (key: string) => ChapterSchema | null,
      ) => void,
    ) => {
      if (mangaObject != null)
        mangaRealm.write(() => {
          fn(mangaObject, (k: string) =>
            mangaRealm.objectForPrimaryKey<ChapterSchema>('Chapter', k),
          );
        });
    },
    [mangaObject, mangaRealm],
  );

  return { manga, refresh, status, error, update };
};
