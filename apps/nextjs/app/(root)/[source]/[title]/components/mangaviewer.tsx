'use client';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import {
  Manga,
  MangaChapter,
  MangaHost,
  MangaMeta,
  WithAuthors,
  WithStatus,
} from '@mangayomu/mangascraper';
import Image from 'next/image';
import React from 'react';
import MangaViewerHeader from './mangaviewerheader';
import Action from './actions';
import Synopsis from './synopsis';
import Status from './status';
import DisplayRowChapters from './displayrowchapters';
import ChaptersHeader from './chaptersheader';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import isMultilingual from '@app/helpers/isMultilingualChapter';
import Genres from './genres';
import SupportedLanguages from './supportedlanguages';
import Authors from './authors';
import MangaSource from './mangasource';
import useObject from '@app/hooks/useObject';

import { ModalMethods } from '@app/components/Modal';
import FilterModal from './filtermodal';
import { inPlaceSort } from 'fast-sort';
import useBoolean from '@app/hooks/useBoolean';
import { integrateSortedList } from '@mangayomu/algorithms';
import getMangaHost from '@app/helpers/getMangaHost';
import * as DOMPurify from 'dompurify';
import ImageCover from './imagecover';
import usePaperBackground from '@app/hooks/usePaperBackground';
import MangaSchema from '@app/realm/Manga';
import {
  IMangaSchema,
  SORT_CHAPTERS_BY,
  SortChaptersBy,
} from '@mangayomu/schemas';
import getMangaMeta from '@app/helpers/getMangaMeta';
import { useUser } from '@app/context/realm';
import cache from '@app/helpers/cache';

interface MangaViewerProps {
  // meta: MangaMeta<MangaChapter> &
  //   Manga &
  //   Partial<WithAuthors> &
  //   Partial<WithStatus>;
  source: string;
  manga: Manga;

  // sanitizedDescription: string;
  // supportedLanguages: [ISOLangCode, string][];
}

export const DEFAULT_LANGUAGE: ISOLangCode = 'en';

const SortLanguages = (a: ISOLangCode, b: ISOLangCode) => {
  const lang1 = languages[a].name;
  const lang2 = languages[b].name;
  return lang1.localeCompare(lang2);
};

export default function MangaViewer(props: MangaViewerProps) {
  const { source, manga: _manga } = props;
  const user = useUser();
  const manga = useObject(
    MangaSchema,
    React.useMemo(
      () => ({ link: _manga.link, _realmId: user.id }),
      [_manga.link, user.id],
    ),
  );

  const [meta, setMeta] = React.useState<
    | (MangaMeta<MangaChapter> &
        Manga &
        Partial<WithAuthors> &
        Partial<WithStatus>)
    | null
  >(null);
  React.useEffect(() => {
    async function init() {
      const p = await cache(_manga.link, () => getMangaMeta(_manga));
      setMeta(p);
    }
    init();
  }, [_manga]);

  const supportedLanguages: [ISOLangCode, string][] | null =
    React.useMemo(() => {
      if (meta == null) return null;
      const supportedLanguages: ISOLangCode[] = [];
      const foundLanguages: Set<ISOLangCode> = new Set();
      const sorted = integrateSortedList(supportedLanguages, SortLanguages);
      if (isMultilingual(meta.chapters)) {
        for (const chapter of meta.chapters) {
          if (!foundLanguages.has(chapter.language)) {
            sorted.add(chapter.language);
            foundLanguages.add(chapter.language);
          }
        }
      } else {
        supportedLanguages.push('en'); // should be host.defaultLanguage; todo later
      }
      return supportedLanguages.map((x) => [x, languages[x].name]);
    }, [meta]);
  const sanitizedDescription = React.useMemo(
    () => (meta != null ? DOMPurify.sanitize(meta.description) : null),
    [meta],
  );
  const modal = React.useRef<ModalMethods>(null);
  const [sortBy, setSortBy] = React.useState<SortChaptersBy>('Chapter number');
  const [reversed, setReversed] = useBoolean();

  const currentlyReadingChapter = React.useMemo(() => {
    if (meta != null && manga.currentlyReadingChapter != null) {
      return meta.chapters?.find(
        (x) => x.link === manga.currentlyReadingChapter?._id,
      );
    }
    return null;
  }, [manga.currentlyReadingChapter, meta]);

  const filteredChapters = React.useMemo(() => {
    if (meta == null) return null;
    let chapters: MangaChapter[];
    if (isMultilingual(meta.chapters)) {
      chapters = meta.chapters.filter((chapter) => {
        if (
          manga.selectedLanguage === 'Use default language' ||
          manga.selectedLanguage == null
        )
          return chapter.language === DEFAULT_LANGUAGE;
        return manga.selectedLanguage === chapter.language;
      });
    } else chapters = meta.chapters;

    return chapters;
  }, [manga, meta]);
  const sortedChapters = React.useMemo(
    () =>
      filteredChapters != null
        ? inPlaceSort(filteredChapters).by(
            reversed
              ? [{ asc: SORT_CHAPTERS_BY[sortBy] }]
              : [{ desc: SORT_CHAPTERS_BY[sortBy] }],
          )
        : null,
    [filteredChapters, sortBy, reversed],
  );
  const handleOnToggleLibrary = async () => {
    manga.update(
      (draft) => {
        if (meta != null) {
          draft.title = meta.title;
          draft.source = meta.source;
          draft.imageCover = meta.imageCover;
          draft.inLibrary = !draft.inLibrary;
          draft.dateAddedInLibrary = Date.now();
        }
      },
      { upsert: true },
    );
  };

  const handleOnSortBy = (val: SortChaptersBy, r: boolean) => {
    setSortBy(val);
    setReversed(r);
  };

  const handleOnSelectLanguage = React.useCallback(
    async (lang: IMangaSchema['selectedLanguage']) => {
      manga.update(
        (draft) => {
          if (meta != null) {
            draft.title = meta.title;
            draft.source = meta.source;
            draft.imageCover = meta.imageCover;
            draft.selectedLanguage = lang;
          }
        },
        { upsert: true },
      );
    },
    [manga, meta],
  );

  usePaperBackground();

  function handleOnOpenFilters() {
    modal.current?.open();
  }
  return (
    <>
      <MangaViewerHeader title={_manga.title} originalUrl={_manga.link} />

      <Screen.Content overrideClassName="relative flex flex-col">
        <div className="md:h-[35rem] h-[15rem] md:-mt-64 w-full bg-gradient-to-b from-transparent to-paper absolute">
          <div
            className="w-full h-full absolute -z-10"
            style={{
              backgroundImage: `url("${
                meta?.imageCover ?? _manga.imageCover
              }")`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
        <div className="z-10 flex flex-col gap-2 m-4 max-w-screen-md flex-grow w-full mx-auto px-4">
          <ImageCover imageCover={meta?.imageCover ?? _manga.imageCover} />
          <Text
            variant="header"
            className="text-center lg:text-variant-header-emphasized md:text-2xl"
          >
            {_manga.title}
          </Text>
          <Authors authors={meta?.authors} />
          <Action
            loading={manga.initializing}
            currentlyReadingChapter={currentlyReadingChapter}
            inLibrary={manga?.inLibrary ?? false}
            onToggleLibrary={handleOnToggleLibrary}
          />
          <Synopsis sanitized={sanitizedDescription} />
          <div className="h-0.5 w-full bg-border" />
          <Genres genres={meta?.genres} source={source} />
          <Text variant="header">Additional info</Text>
          <Status status={meta?.status} loading={meta == null} />
          <MangaSource source={_manga.source} />
          <SupportedLanguages languages={supportedLanguages} />
          <ChaptersHeader
            chaptersLen={filteredChapters?.length}
            onOpenFilters={handleOnOpenFilters}
          />
        </div>
        <div className="h-0.5 w-full bg-border max-w-screen-md mx-auto" />
        <DisplayRowChapters chapters={sortedChapters} />
      </Screen.Content>
      <FilterModal
        ref={modal}
        onSort={handleOnSortBy}
        sortBy={sortBy}
        reversed={reversed}
        supportedLanguages={supportedLanguages}
        selectedLanguage={manga?.selectedLanguage ?? 'Use default language'}
        onSelectLanguage={handleOnSelectLanguage}
      />
    </>
  );
}
