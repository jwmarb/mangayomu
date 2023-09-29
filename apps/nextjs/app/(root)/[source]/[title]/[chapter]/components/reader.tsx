'use client';
const Overlay = React.lazy(() => import('./overlay'));
import Renderer from '@app/(root)/[source]/[title]/[chapter]/components/renderer';
import { ChapterContext } from '@app/(root)/[source]/[title]/[chapter]/context/ChapterContext';
import { IndexContext } from '@app/(root)/[source]/[title]/[chapter]/context/IndexContext';
import { MangaContext } from '@app/(root)/[source]/[title]/[chapter]/context/MangaContext';
import useReaderSetting from '@app/(root)/[source]/[title]/[chapter]/hooks/useReaderSetting';
import Text from '@app/components/Text';
import { useReaderSettings } from '@app/context/readersettings';
import getErrorMessage from '@app/helpers/getErrorMessage';
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
  const readingDirection = useReaderSetting('readerDirection', manga);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const host = useMangaHost(source);
  const [pages, setPages] = React.useState<string[]>([]);
  const [chapter, setChapter] =
    React.useState<ISourceChapterSchema>(initialChapter);
  const [error, setError] = React.useState<string>('');
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
    console.log(`fetching ${chapter}`);
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
    setIndex((prev) => Math.min(prev + 1, pagesLenRef.current - 1));
  }, [setIndex]);
  const previous = React.useCallback(() => {
    setIndex((prev) => Math.max(0, prev - 1));
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
          <React.Suspense>
            <Overlay />
          </React.Suspense>
          <Renderer pages={pages} onNextPage={next} onPreviousPage={previous} />
        </IndexContext.Provider>
      </ChapterContext.Provider>
    </MangaContext.Provider>
  );
}
