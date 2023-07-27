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
import MangaSchema, { IMangaSchema } from '@app/realm/Manga';
import useMongoClient from '@app/hooks/useMongoClient';
import { useUser } from '@app/context/realm';
import { ModalMethods } from '@app/components/Modal';
import FilterModal from '@app/(root_bg_paper)/[source]/[title]/components/filtermodal';

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
  const mangas = useMongoClient(MangaSchema);
  const manga = useObject<IMangaSchema>(MangaSchema, meta.link);
  const user = useUser();
  const modal = React.useRef<ModalMethods>(null);
  const filteredChapters = React.useMemo(() => {
    if (isMultilingual(meta.chapters)) {
      return meta.chapters.filter((chapter) =>
        manga?.selectedLanguage === 'Use default language'
          ? chapter.language === DEFAULT_LANGUAGE
          : manga != null
          ? chapter.language === manga.selectedLanguage
          : chapter.language === DEFAULT_LANGUAGE,
      );
    }
    return meta.chapters;
  }, [manga, meta.chapters]);
  const handleOnToggleLibrary = async () => {
    if (manga != null) {
      manga.update((draft) => {
        draft.inLibrary = !draft.inLibrary;
      });
    } else {
      console.log('Adding to cloud');
      await mangas.insertOne({
        ...meta,
        _id: meta.link,
        _realmId: user.id,
        inLibrary: true,
        selectedLanguage: 'Use default language',
        readerDirection: 'Use global setting',
        readerImageScaling: 'Use global setting',
        readerLockOrientation: 'Use global setting',
        readerZoomStartPosition: 'Use global setting',
      });
    }
  };

  const handleOnSelectLanguage = React.useCallback(
    async (lang: IMangaSchema['selectedLanguage']) => {
      if (manga != null) {
        manga.update((draft) => {
          draft.selectedLanguage = lang;
        });
      } else {
        console.log('Adding to cloud');
        await mangas.insertOne({
          ...meta,
          _id: meta.link,
          _realmId: user.id,
          inLibrary: false,
          selectedLanguage: lang,
          readerDirection: 'Use global setting',
          readerImageScaling: 'Use global setting',
          readerLockOrientation: 'Use global setting',
          readerZoomStartPosition: 'Use global setting',
        });
      }
    },
    [manga, mangas, meta, user.id],
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
        <DisplayRowChapters chapters={filteredChapters} />
      </Screen.Content>
      <FilterModal
        ref={modal}
        supportedLanguages={supportedLanguages}
        selectedLanguage={manga?.selectedLanguage ?? 'Use default language'}
        onSelectLanguage={handleOnSelectLanguage}
      />
    </>
  );
}
