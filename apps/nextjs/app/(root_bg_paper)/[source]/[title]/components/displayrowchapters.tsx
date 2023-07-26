'use client';
import { MangaChapter } from '@mangayomu/mangascraper';
import RowChapter from './rowchapter';
import React from 'react';
import useMongoClient from '@app/hooks/useMongoClient';
import MangaSchema, { IMangaSchema } from '@app/realm/Manga';
import useObject from '@app/hooks/useObject';
import Button from '@app/components/Button';

interface DisplayRowChaptersProps {
  chapters: MangaChapter[];
  mangaId: string;
}

export default function DisplayRowChapters(props: DisplayRowChaptersProps) {
  const { chapters, mangaId } = props;
  const manga = useObject<IMangaSchema>(MangaSchema, mangaId);

  return (
    <>
      <Button
        onPress={() => {
          // console.log(manga);
          manga?.update((prev) => {
            prev.inLibrary = !prev.inLibrary;
          });
        }}
      >
        Test
      </Button>
      <div className="max-w-screen-md mx-auto w-full flex flex-col">
        {chapters.map((x, i, self) => (
          <RowChapter
            chapter={x}
            key={x.link}
            isLastItem={i === self.length - 1}
          />
        ))}
      </div>
    </>
  );
}
