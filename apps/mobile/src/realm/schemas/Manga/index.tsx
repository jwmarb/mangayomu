import {
  Manga,
  MangaChapter,
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
  'Chapter number':
    (reversed: boolean) => (a: MangaChapter, b: MangaChapter) => {
      if (a.name && b.name) {
        const aName = a.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
        const bName = b.name.match(/(0|[1-9]\d*)(\.\d+)?/g);
        if (aName != null && bName != null)
          return (
            (reversed ? -1 : 1) * (parseFloat(bName[0]) - parseFloat(aName[0]))
          );
      }
      if (a.index != null && b.index != null)
        return (reversed ? -1 : 1) * (b.index - a.index);
      throw Error('Chapter cannot be sorted due to undefined name and index');
    },
};

export interface IMangaSchema
  extends Omit<Manga, 'index'>,
    Partial<WithAuthors>,
    Partial<WithStatus>,
    Partial<WithHentai>,
    Partial<WithRating> {
  description: string | null;
  genres: string[];
  currentlyReadingChapter?: string;
  dateAddedInLibrary?: string;
  notifyNewChaptersCount?: number;
  chapters: string[];
  sortChaptersBy: keyof typeof SORT_CHAPTERS_BY;
  inLibrary: boolean;
}

export class MangaSchema extends Realm.Object<IMangaSchema> {
  link!: string;
  title!: string;
  imageCover!: string;
  source!: string;
  description!: string | null;
  genres!: string[];
  currentlyReadingChapter!: string;
  dateAddedInLibrary!: string;
  modifyNewChaptersCount!: number;
  chapters!: string[];
  sortChaptersBy!: keyof typeof SORT_CHAPTERS_BY;
  inLibrary!: boolean;
  authors!: string[];
  isHentai!: boolean;
  rating!: WithRating['rating'];
  status!: WithStatus['status'];

  static schema: Realm.ObjectSchema = {
    name: 'Manga',
    properties: {
      link: 'string',
      title: 'string',
      imageCover: 'string',
      source: 'string',
      description: 'mixed',
      genres: 'string[]',
      currentlyReadingChapter: 'string?',
      dateAddedInLibrary: 'string?',
      notifyNewChaptersCount: { type: 'int?', default: 0 },
      chapters: 'string[]',
      sortChaptersBy: { type: 'string', default: 'Chapter number' },
      authors: { type: 'string?[]', default: [] },
      isHentai: { type: 'bool', default: false },
      rating: 'MangaRating?',
      inLibrary: { type: 'bool', default: false },
      status: 'MangaStatus?',
    },
    primaryKey: 'link',
  };
}

export type UseMangaOptions = {
  preferLocal?: boolean;
};

export type FetchMangaMetaStatus = 'loading' | 'success' | 'local' | 'error';

export const useManga = (
  link: string | Manga,
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
  const fetchData = React.useCallback(() => {
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
      source
        .getMeta(manga)
        .then((meta) => {
          mangaRealm.write(() => {
            mangaRealm.create<MangaSchema>(
              'Manga',
              {
                ...meta,
                chapters: meta.chapters.map((x) => x.link),
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
        })
        .catch((e) => {
          setStatus('error');
          setError(getErrorMessage(e));
        });
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
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      fetchData();
    });
  }, []);
  React.useEffect(() => {
    mangaObject?.addListener((_manga, changes) => {
      if (status === 'loading') setStatus('success');
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
      ) => void,
    ) => {
      if (mangaObject != null)
        mangaRealm.write(() => {
          fn(mangaObject);
        });
    },
    [mangaObject, mangaRealm],
  );

  return { manga, refresh: fetchData, status, error, update };
};
