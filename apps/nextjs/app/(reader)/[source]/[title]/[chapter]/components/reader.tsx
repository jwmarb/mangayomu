'use client';
const Overlay = React.lazy(() => import('./overlay'));
import Renderer from '@app/(reader)/[source]/[title]/[chapter]/components/renderer';
import { ChapterContext } from '@app/(reader)/[source]/[title]/[chapter]/context/ChapterContext';
import { IndexContext } from '@app/(reader)/[source]/[title]/[chapter]/context/IndexContext';
import { MangaContext } from '@app/(reader)/[source]/[title]/[chapter]/context/MangaContext';
import { useReaderSettings } from '@app/context/readersettings';
import useBoolean from '@app/hooks/useBoolean';
import useMangaHost from '@app/hooks/useMangaHost';
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
  const readingDirection = useReaderSettings((state) => state.readingDirection);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const host = useMangaHost(source);
  const [pages, setPages] = React.useState<string[]>([]);
  const [chapter, setChapter] =
    React.useState<ISourceChapterSchema>(initialChapter);
  const [index, _setIndex] = React.useState<number>(() => {
    const x = params.get('page');
    if (x == null) return 0;
    return Math.max(0, parseInt(x) - 1);
  });
  const pagesLenRef = React.useRef(pages.length);
  pagesLenRef.current = pages.length;

  const indexRef = React.useRef(index);
  indexRef.current = index;
  const setIndex: typeof _setIndex = React.useCallback(
    (x) => {
      if (typeof x === 'function') {
        const r = x(indexRef.current);
        indexRef.current = r;
        router.replace(pathname + '?' + `page=${r + 1}`);
        _setIndex(r);
      } else {
        indexRef.current = x;
        router.replace(pathname + '?' + `page=${x + 1}`);
        _setIndex(x);
      }
    },
    [pathname, router],
  );
  const [loading, toggleLoading] = useBoolean(true);
  React.useEffect(() => {
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
      .finally(() => toggleLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const next = React.useCallback(() => {
    setIndex((prev) => Math.min(prev + 1, pagesLenRef.current - 1));
  }, [setIndex]);
  const previous = React.useCallback(() => {
    setIndex((prev) => Math.max(0, prev - 1));
  }, [setIndex]);
  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          if (readingDirection === ReadingDirection.RIGHT_TO_LEFT) previous();
          else next();
          break;
        case 'ArrowLeft':
          if (readingDirection === ReadingDirection.RIGHT_TO_LEFT) next();
          else previous();
          break;
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [next, previous, readingDirection]);
  return (
    <MangaContext.Provider value={manga}>
      <ChapterContext.Provider value={chapter}>
        <IndexContext.Provider value={index}>
          <React.Suspense>
            <Overlay />
          </React.Suspense>
          <Renderer pages={pages} onNextPage={next} onPreviousPage={previous} />
        </IndexContext.Provider>
      </ChapterContext.Provider>
    </MangaContext.Provider>
  );
}
