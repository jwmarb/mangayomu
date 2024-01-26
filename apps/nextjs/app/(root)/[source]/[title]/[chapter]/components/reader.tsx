'use client';
const Overlay = React.lazy(() => import('./overlay'));
import Renderer from '@app/(root)/[source]/[title]/[chapter]/components/renderer';
import { ChapterContext } from '@app/(root)/[source]/[title]/[chapter]/context/ChapterContext';
import { IndexContext } from '@app/(root)/[source]/[title]/[chapter]/context/IndexContext';
import { MangaContext } from '@app/(root)/[source]/[title]/[chapter]/context/MangaContext';
import { PagesContext } from '@app/(root)/[source]/[title]/[chapter]/context/PagesContext';
import useReaderSetting from '@app/(root)/[source]/[title]/[chapter]/hooks/useReaderSetting';
import Text from '@app/components/Text';
import { useReaderSettings } from '@app/context/readersettings';
import { useUser } from '@app/context/realm';
import getErrorMessage from '@app/helpers/getErrorMessage';
import useBoolean from '@app/hooks/useBoolean';
import useMangaHost from '@app/hooks/useMangaHost';
import useObject from '@app/hooks/useObject';
import ChapterSchema from '@app/realm/Chapter';
import MangaSchema from '@app/realm/Manga';
import {
  ISourceChapterSchema,
  ISourceMangaSchema,
  ReadingDirection,
} from '@mangayomu/schemas';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface ReaderProps {
  source: string;
  chapter: ISourceChapterSchema;
  manga: ISourceMangaSchema;
}

export default function Reader({
  source,
  chapter: initialChapter,
  manga,
}: ReaderProps) {
  const readingDirection = useReaderSetting('readerDirection', manga);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const host = useMangaHost(source);
  const [pages, setPages] = React.useState<string[]>([]);
  const [chapter, setChapter] =
    React.useState<ISourceChapterSchema>(initialChapter);
  const userChapterData = useObject(ChapterSchema, { link: chapter.link });
  const userMangaData = useObject(MangaSchema, { link: manga.link });
  const [error, setError] = React.useState<string>('');
  const [index, _setIndex] = React.useState<number>(() => {
    const x = params.get('page');
    if (x == null) return 0;
    return Math.max(0, parseInt(x) - 1);
  });
  const [loading, toggleLoading] = useBoolean(true);

  const pagesLenRef = React.useRef(pages.length);
  pagesLenRef.current = pages.length;

  const indexRef = React.useRef(index);
  indexRef.current = index;

  const hasStartAtIndex = React.useRef<boolean>(false);
  const setIndex: typeof _setIndex = React.useCallback(
    (x) => {
      if (typeof x === 'function') {
        const r = x(indexRef.current);
        if (r >= pagesLenRef.current) {
          if (chapter._nextId != null)
            router.replace('/' + chapter._nextId + '?' + 'page=1');
          else router.push('/' + manga._id);
        } else if (r < 0) {
          if (chapter._prevId != null) router.replace('/' + chapter._prevId);
        } else {
          indexRef.current = r;
          _setIndex(r);
        }
      } else {
        indexRef.current = x;
        _setIndex(x);
      }
    },
    [chapter._nextId, chapter._prevId, router, manga._id],
  );
  React.useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(
        () => router.replace(pathname + '?' + `page=${index + 1}`),
        50,
      );

      const mangaId = userMangaData._id;
      console.log(userChapterData);
      if (mangaId != null) {
        userMangaData.update((draft) => {
          draft.currentlyReadingChapter = {
            _id: chapter.link,
            index,
            numOfPages: pages.length,
          };
        });
        userChapterData.update((draft) => {
          draft.indexPage = index;
        });
      }
      return () => {
        clearTimeout(timeout);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, pathname, index, loading]);

  // React.useEffect(() => {
  //   if (
  //     !userMangaData.initializing &&
  //     userMangaData.link != null &&
  //     pages.length > 0
  //   ) {
  //     console.log('Inserting');
  //     userMangaData.insert({
  //       dateAddedInLibrary: undefined,
  //       currentlyReadingChapter: {
  //         _id: chapter.link,
  //         index: 0,
  //         numOfPages: pages.length,
  //       },
  //       imageCover: manga.imageCover,
  //       inLibrary: false,
  //       link: manga.link,
  //       title: manga.title,
  //       source: manga.source,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   userMangaData.initializing,
  //   userMangaData.link,
  //   pages,
  //   manga.imageCover,
  //   manga.link,
  //   manga.title,
  //   manga.source,
  //   chapter.link,
  // ]);

  // React.useEffect(() => {
  //   if (!hasStartAtIndex.current) {
  //     const _mangaId = userMangaData._id;
  //     if (!userChapterData.initializing && userChapterData.indexPage != null) {
  //       setIndex(userChapterData.indexPage);
  //       hasStartAtIndex.current = true;
  //     } else if (
  //       !userChapterData.initializing &&
  //       pages.length > 0 &&
  //       userChapterData.indexPage == null &&
  //       _mangaId != null
  //     ) {
  //       userChapterData.insert({
  //         _mangaId,
  //         dateRead: Date.now(),
  //         indexPage: 0,
  //         language: chapter.language,
  //         link: chapter.link,
  //         numberOfPages: pages.length,
  //         savedScrollPositionType: 'portrait',
  //         scrollPosition: undefined,
  //       });
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   setIndex,
  //   userChapterData.initializing,
  //   userChapterData.indexPage,
  //   pages,
  //   chapter.link,
  //   chapter.language,
  //   userMangaData._id,
  // ]);

  React.useEffect(() => {
    toggleLoading(true);
    host
      .getPages(chapter)
      .then((pages) => {
        setPages(pages);
        for (let i = 0; i < pages.length; i++) {
          const img = new Image();
          img.src = pages[i];
        }
        if (index >= pages.length) setIndex(pages.length - 1);
      })
      // .catch((e) => setError(getErrorMessage(e)))
      .finally(() => toggleLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const next = React.useCallback(() => {
    setIndex((prev) => prev + 1);
  }, [setIndex]);
  const previous = React.useCallback(() => {
    setIndex((prev) => prev - 1);
  }, [setIndex]);
  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (readingDirection === ReadingDirection.VERTICAL) previous();
          break;
        case 'ArrowRight':
          if (readingDirection === ReadingDirection.RIGHT_TO_LEFT) previous();
          else next();
          break;
        case 'ArrowLeft':
          if (readingDirection === ReadingDirection.RIGHT_TO_LEFT) next();
          else previous();
          break;
        case 'ArrowDown':
          if (readingDirection === ReadingDirection.VERTICAL) next();
          break;
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [next, previous, readingDirection]);
  if (error) return <Text variant="header">{error}</Text>;
  return (
    <MangaContext.Provider value={manga}>
      <ChapterContext.Provider value={chapter}>
        <IndexContext.Provider value={index}>
          <PagesContext.Provider value={pages.length}>
            <React.Suspense>
              <Overlay />
            </React.Suspense>
            <Renderer
              pages={pages}
              onNextPage={next}
              onPreviousPage={previous}
            />
          </PagesContext.Provider>
        </IndexContext.Provider>
      </ChapterContext.Provider>
    </MangaContext.Provider>
  );
}
