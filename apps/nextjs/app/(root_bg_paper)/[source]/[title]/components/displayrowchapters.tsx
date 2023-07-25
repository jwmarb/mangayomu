'use client';
import { MangaChapter } from '@mangayomu/mangascraper';
import RowChapter from './rowchapter';
import React from 'react';
import { useApp } from '@app/context/realm';

interface DisplayRowChaptersProps {
  chapters: MangaChapter[];
}

export default function DisplayRowChapters(props: DisplayRowChaptersProps) {
  const { chapters } = props;
  const realm = useApp();

  return (
    <div className="max-w-screen-md mx-auto w-full flex flex-col">
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
