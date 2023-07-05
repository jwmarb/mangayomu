'use client';
import Text from '@app/components/Text';
import { MangaHost } from '@mangayomu/mangascraper';
import React from 'react';

interface ListSourceProps {
  src: string;
}

export default function ListSource(props: ListSourceProps) {
  const { src: strSource } = props;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const source = MangaHost.getAvailableSources().get(strSource)!;

  return (
    <button className="flex flex-row items-center space-x-2 hover:bg-hover border-2 border-transparent focus:border-primary/[.3] p-1 rounded-lg">
      <img src={source.getIcon()} loading="lazy" className="w-6 h-6" />
      <Text variant="button">{source.getName()}</Text>
    </button>
  );
}
