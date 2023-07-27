'use client';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import {
  Manga,
  MangaChapter,
  MangaMeta,
  WithAuthors,
  WithStatus,
} from '@mangayomu/mangascraper';
import Image from 'next/image';
import React from 'react';
import MangaViewerHeader from '@app/(root_bg_paper)/[source]/[title]/components/mangaviewerheader';
import Action from '@app/(root_bg_paper)/[source]/[title]/components/actions';
import Synopsis from '@app/(root_bg_paper)/[source]/[title]/components/synopsis';
import Status from '@app/(root_bg_paper)/[source]/[title]/components/status';
import DisplayRowChapters from '@app/(root_bg_paper)/[source]/[title]/components/displayrowchapters';
import ChaptersHeader from '@app/(root_bg_paper)/[source]/[title]/components/chaptersheader';
import { ISOLangCode } from '@mangayomu/language-codes';
import isMultilingual from '@app/helpers/isMultilingualChapter';
import Genres from '@app/(root_bg_paper)/[source]/[title]/components/genres';
import SupportedLanguages from '@app/(root_bg_paper)/[source]/[title]/components/supportedlanguages';
import Authors from '@app/(root_bg_paper)/[source]/[title]/components/authors';
import MangaSource from '@app/(root_bg_paper)/[source]/[title]/components/mangasource';
import useObject from '@app/hooks/useObject';
import MangaSchema, {
  IMangaSchema,
  SORT_CHAPTERS_BY,
  SortChaptersByType,
} from '@app/realm/Manga';
import useMongoClient from '@app/hooks/useMongoClient';
import { useUser } from '@app/context/realm';
import { ModalMethods } from '@app/components/Modal';
import FilterModal from '@app/(root_bg_paper)/[source]/[title]/components/filtermodal';
import { inPlaceSort } from 'fast-sort';
import useBoolean from '@app/hooks/useBoolean';

interface MangaViewerProps {
  meta: MangaMeta<MangaChapter> &
    Manga &
    Partial<WithAuthors> &
    Partial<WithStatus>;
  source: string;
  sanitizedDescription: string;
  supportedLanguages: [ISOLangCode, string][];
}

export const DEFAULT_LANGUAGE: ISOLangCode = 'en';

export default function MangaViewer(props: MangaViewerProps) {
  const { meta, source, sanitizedDescription, supportedLanguages } = props;
  const manga = useObject(MangaSchema, meta.link);
  const modal = React.useRef<ModalMethods>(null);
  const [sortBy, setSortBy] =
    React.useState<SortChaptersByType>('Chapter number');
  const [reversed, setReversed] = useBoolean();

  const filteredChapters = React.useMemo(() => {
    let chapters: MangaChapter[];
    if (isMultilingual(meta.chapters)) {
      chapters = meta.chapters.filter((chapter) =>
        manga?.selectedLanguage === 'Use default language'
          ? chapter.language === DEFAULT_LANGUAGE
          : manga != null
          ? chapter.language === manga.selectedLanguage
          : chapter.language === DEFAULT_LANGUAGE,
      );
    } else chapters = meta.chapters;

    return chapters;
  }, [manga, meta.chapters]);
  const sortedChapters = React.useMemo(
    () =>
      inPlaceSort(filteredChapters).by(
        reversed
          ? [{ asc: SORT_CHAPTERS_BY[sortBy] }]
          : [{ desc: SORT_CHAPTERS_BY[sortBy] }],
      ),
    [filteredChapters, sortBy, reversed],
  );
  const handleOnToggleLibrary = async () => {
    manga.update(
      (draft) => {
        draft.title = meta.title;
        draft.source = meta.source;
        draft.imageCover = meta.imageCover;
        draft.inLibrary = !draft.inLibrary;
        draft.dateAddedInLibrary = Date.now();
      },
      { upsert: true },
    );
  };

  const handleOnSortBy = (val: SortChaptersByType, r: boolean) => {
    setSortBy(val);
    setReversed(r);
  };

  const handleOnSelectLanguage = React.useCallback(
    async (lang: IMangaSchema['selectedLanguage']) => {
      manga.update(
        (draft) => {
          draft.title = meta.title;
          draft.source = meta.source;
          draft.imageCover = meta.imageCover;
          draft.selectedLanguage = lang;
        },
        { upsert: true },
      );
    },
    [manga, meta.imageCover, meta.source, meta.title],
  );

  function handleOnOpenFilters() {
    modal.current?.open();
  }
  return (
    <>
      <MangaViewerHeader title={meta.title} />
      <Screen.Content overrideClassName="relative flex flex-col">
        <div className="md:h-[35rem] h-[15rem] md:-mt-64 w-full bg-gradient-to-b from-transparent to-paper absolute">
          <div
            className="w-full h-full absolute -z-10"
            style={{
              backgroundImage: `url("${meta.imageCover}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>
        <div className="z-10 flex flex-col gap-2 m-4 max-w-screen-md flex-grow w-full mx-auto px-4">
          <Image
            width={768}
            height={768}
            src={meta.imageCover}
            className="mx-auto object-contain rounded-lg max-w-full w-40 md:w-52 top-4"
            alt="Image cover"
          />
          <Text
            variant="header"
            className="text-center lg:text-variant-header-emphasized md:text-2xl"
          >
            {meta.title}
          </Text>
          <Authors authors={meta.authors} />
          <Action
            inLibrary={manga?.inLibrary}
            onToggleLibrary={handleOnToggleLibrary}
          />
          <Synopsis sanitized={sanitizedDescription} />
          <div className="h-0.5 w-full bg-border" />
          <Genres genres={meta.genres} source={source} />
          <Text variant="header">Additional info</Text>
          <Status status={meta.status} />
          <MangaSource source={meta.source} />
          <SupportedLanguages languages={supportedLanguages} />
          <ChaptersHeader
            chaptersLen={filteredChapters.length}
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
