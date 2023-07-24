import Button from '@app/components/Button';
import IconButton from '@app/components/IconButton';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import {
  Manga,
  MangaChapter,
  MangaHost,
  MangaMeta,
  MangaMultilingualChapter,
  WithAuthors,
  WithStatus,
} from '@mangayomu/mangascraper';
import Image from 'next/image';
import React from 'react';
import {
  MdArrowBack,
  MdArrowDropDown,
  MdArrowDropUp,
  MdBook,
  MdBookmarkAdd,
  MdFilterList,
} from 'react-icons/md';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import MangaViewerHeader from '@app/(root)/[source]/[title]/components/mangaviewerheader';
import Action from '@app/(root)/[source]/[title]/components/actions';
import Synopsis from '@app/(root)/[source]/[title]/components/synopsis';
import Status from '@app/(root)/[source]/[title]/components/status';
import Genre from '@app/(root)/[source]/[title]/components/genre';
import RowChapter from '@app/(root)/[source]/[title]/components/rowchapter';

interface MangaViewerProps {
  meta: MangaMeta<MangaChapter> &
    Manga &
    Partial<WithAuthors> &
    Partial<WithStatus>;
  host: MangaHost;
}

export default function MangaViewer(props: MangaViewerProps) {
  const { meta, host } = props;
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  const sanitizedDescription = purify.sanitize(meta.description);
  return (
    <>
      {/* <div className="md:h-[35rem] h-[15rem] relative md:-mt-64 bg-gradient-to-b from-transparent to-default">
        <Image
          fill
          src={meta.imageCover}
          className="object-cover object-top brightness-50 -z-10"
          alt="Image cover"
        />
      </div> */}
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
          <Text color="text-secondary" className="text-center">
            by {meta.authors?.join(', ') ?? 'unknown'}
          </Text>
          <Action />
          <Synopsis sanitized={sanitizedDescription} />
          <div className="h-0.5 w-full bg-border" />
          <div className="flex flex-row flex-wrap gap-2">
            {meta.genres.map((x) => (
              <Genre key={x} genre={host.getGenre(x)} />
            ))}
          </div>
          <Text variant="header">Additional info</Text>
          <Status status={meta.status} />
          <div className="flex flex-row justify-between gap-2">
            <Text color="text-secondary">Source</Text>
            <Text className="font-medium">{meta.source}</Text>
          </div>
          <div className="grid grid-cols-2 justify-between gap-2">
            <Text color="text-secondary">Supported languages</Text>
            <Text className="font-medium text-end">English</Text>
          </div>
          <div className="flex flex-row justify-between gap-2 items-center">
            <Text variant="header">
              {meta.chapters.length} Chapter
              {meta.chapters.length !== 1 ? 's' : ''}
            </Text>
            <Button icon={<MdFilterList />}>Filters</Button>
          </div>
        </div>
        <div className="h-0.5 w-full bg-border max-w-screen-md mx-auto" />
        <div className="max-w-screen-md mx-auto w-full flex flex-col">
          {meta.chapters.map((x) => (
            <RowChapter chapter={x} key={x.link} />
          ))}
        </div>
      </Screen.Content>
    </>
  );
}

function isMultilingualChapter(x: MangaChapter): x is MangaMultilingualChapter {
  return 'language' in x;
}
