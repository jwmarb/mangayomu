'use client';
import { MangaChapter } from '@mangayomu/mangascraper';
import RowChapter from './rowchapter';
import React from 'react';

interface DisplayRowChaptersProps {
  chapters: MangaChapter[];
  expanded: boolean;
}

export default function DisplayRowChapters(props: DisplayRowChaptersProps) {
  const { chapters, expanded } = props;

  return (
    <div
      className={`max-w-screen-md mx-auto w-full flex flex-col ${
        expanded ? '' : 'max-h-[100px]'
      } overflow-hidden`}
    >
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
