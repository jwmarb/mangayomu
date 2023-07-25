'use client';
import { MangaChapter } from '@mangayomu/mangascraper';
import RowChapter from './rowchapter';
import React from 'react';
import useMongoClient from '@app/hooks/useMongoClient';
import MangaSchema from '@app/realm/Manga';

interface DisplayRowChaptersProps {
  chapters: MangaChapter[];
  mangaId: string;
}

export default function DisplayRowChapters(props: DisplayRowChaptersProps) {
  const { chapters, mangaId } = props;
  const mangas = useMongoClient(MangaSchema);
  const getManga = React.useCallback(async () => {
    const p = await mangas.findOne({ _id: mangaId });
    console.log(p);
  }, [mangas, mangaId]);
  React.useEffect(() => {
    getManga();
  }, [getManga]);

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
