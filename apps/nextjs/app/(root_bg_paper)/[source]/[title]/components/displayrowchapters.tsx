'use client';
import { MangaChapter } from '@mangayomu/mangascraper';
import RowChapter from './rowchapter';
import React from 'react';

interface DisplayRowChaptersProps {
  chapters: MangaChapter[];
}

export default function DisplayRowChapters(props: DisplayRowChaptersProps) {
  const { chapters } = props;

  return (
    <div className="max-w-screen-md mx-auto w-full flex flex-col max-h-[41.25rem] overflow-y-auto pb-96">
      {chapters.map((x, i, self) => (
        <RowChapter
          chapter={x}
          key={x.link}
          isLastItem={i === self.length - 1}
        />
      ))}
    </div>
  );
}
