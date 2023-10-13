import { useReaderSettings } from '@app/context/readersettings';
import { ReadingDirection } from '@mangayomu/schemas';
import ChapterPage from './chapterpage';
import React from 'react';
import { useIndex } from '../context/IndexContext';
import { useReader } from '@app/(root)/[source]/[title]/[chapter]/context/reader';
import useReaderSetting from '@app/(root)/[source]/[title]/[chapter]/hooks/useReaderSetting';
import { useManga } from '@app/(root)/[source]/[title]/[chapter]/context/MangaContext';

interface RendererProps {
  pages: string[];
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export default function Renderer(props: RendererProps) {
  const { pages, onNextPage, onPreviousPage } = props;
  const toggleOverlay = useReader((state) => state.toggleOverlay);
  const index = useIndex();
  const manga = useManga();
  const backgroundColor = useReaderSettings((s) => s.backgroundColor);
  React.useLayoutEffect(() => {
    document.body.className = backgroundColor;
  }, [backgroundColor]);
  const readingDirection = useReaderSetting('readerDirection', manga);
  switch (readingDirection) {
    case ReadingDirection.WEBTOON:
      return (
        <div className="flex min-w-[100vw] min-h-[100vh] items-center justify-center relative flex-col">
          <button
            className="outline-none fixed right-[50%] translate-x-[50%] top-0 bottom-0 w-[50%] h-full"
            onClick={() => toggleOverlay()}
          />
          {pages.map((x) => (
            <ChapterPage key={x} page={x} />
          ))}
        </div>
      );
    default:
      return (
        <div className="flex min-w-[100vw] min-h-[100vh] items-center justify-center relative flex-row">
          <ChapterPage page={pages[index]} />
          <button
            className="outline-none absolute left-0 top-0 bottom-0 w-[25%] h-full"
            onClick={
              readingDirection === ReadingDirection.LEFT_TO_RIGHT
                ? onPreviousPage
                : onNextPage
            }
          />
          <button
            className="outline-none absolute right-0 top-0 bottom-0 w-[25%] h-full"
            onClick={
              readingDirection === ReadingDirection.LEFT_TO_RIGHT
                ? onNextPage
                : onPreviousPage
            }
          />
          <button
            className="outline-none absolute right-[50%] translate-x-[50%] top-0 bottom-0 w-[50%] h-full"
            onClick={() => toggleOverlay()}
          />
        </div>
      );
  }
}
