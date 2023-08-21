import { useReaderSettings } from '@app/context/readersettings';
import { ReadingDirection } from '@mangayomu/schemas';
import ChapterPage from './chapterpage';
import React from 'react';
import { useIndex } from '../context/IndexContext';
import { useReader } from '@app/(reader)/[source]/[title]/[chapter]/context/reader';

interface RendererProps {
  pages: string[];
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export default function Renderer(props: RendererProps) {
  const { pages, onNextPage, onPreviousPage } = props;
  const toggleOverlay = useReader((state) => state.toggleOverlay);
  const index = useIndex();
  const backgroundColor = useReaderSettings((state) => state.backgroundColor);
  const readingDirection = useReaderSettings((state) => state.readingDirection);
  return (
    <div
      className={`${backgroundColor} h-[100vh] flex items-center justify-center relative flex-row`}
    >
      <ChapterPage key={pages[index]} page={pages[index]} />
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
