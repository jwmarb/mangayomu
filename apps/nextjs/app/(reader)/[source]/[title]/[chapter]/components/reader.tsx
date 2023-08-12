'use client';
import ChapterPage from '@app/(reader)/[source]/[title]/[chapter]/components/chapterpage';
import Text from '@app/components/Text';
import { useReaderSettings } from '@app/context/readersettings';
import useBoolean from '@app/hooks/useBoolean';
import useMangaHost from '@app/hooks/useMangaHost';
import { ISourceChapterSchema, ReadingDirection } from '@mangayomu/schemas';
import React from 'react';

interface ReaderProps {
  source: string;
  chapter: ISourceChapterSchema;
}

export default function Reader({ source, chapter }: ReaderProps) {
  const backgroundColor = useReaderSettings((state) => state.backgroundColor);
  const readingDirection = useReaderSettings((state) => state.readingDirection);
  const host = useMangaHost(source);
  const [pages, setPages] = React.useState<string[]>([]);
  const pagesLenRef = React.useRef(pages.length);
  pagesLenRef.current = pages.length;
  const [index, setIndex] = React.useState<number>(0);
  const [loading, toggleLoading] = useBoolean(true);
  React.useEffect(() => {
    // console.log(chapter);
    host
      .getPages(chapter)
      .then(setPages)
      .finally(() => toggleLoading(false));
  }, [chapter, host, toggleLoading]);
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
          next();
          break;
        case 'ArrowLeft':
          previous();
          break;
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);
  switch (readingDirection) {
    case ReadingDirection.LEFT_TO_RIGHT:
    case ReadingDirection.RIGHT_TO_LEFT:
      return (
        <div
          className={`${backgroundColor} min-w-[100vw] min-h-[100vh] flex items-center justify-center relative`}
        >
          <ChapterPage page={pages[index]} />
          <button
            className="outline-none absolute left-0 top-0 bottom-0 w-[50%] h-full"
            onClick={
              readingDirection === ReadingDirection.LEFT_TO_RIGHT
                ? previous
                : next
            }
          />
          <button
            className="outline-none absolute right-0 top-0 bottom-0 w-[50%] h-full"
            onClick={
              readingDirection === ReadingDirection.LEFT_TO_RIGHT
                ? next
                : previous
            }
          />
        </div>
      );
    case ReadingDirection.VERTICAL:
    case ReadingDirection.WEBTOON:
      return (
        <div
          className={`${backgroundColor} min-w-[100vw] min-h-[100vh] flex items-center justify-center`}
        >
          {pages.map((x, i) => (
            <ChapterPage key={x} page={x} />
          ))}
        </div>
      );
  }
}
