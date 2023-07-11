'use client';
import Text from '@app/components/Text';
import { MangaHost } from '@mangayomu/mangascraper';
import React from 'react';

interface GenreProps {
  genre: string;
}

export default function Genre(props: GenreProps) {
  const { genre } = props;
  return (
    <button className="bg-tag px-3 py-1.5 rounded-full hover:bg-hoverduration-250 transition focus:bg-hover focus:outline focus:outline-2 focus:outline-primary/[.3]">
      <Text className="font-normal text-sm tracking-tight">{genre}</Text>
    </button>
  );
}
