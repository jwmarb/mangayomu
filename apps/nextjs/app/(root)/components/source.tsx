import Text from '@app/components/Text';
import { MangaHost } from '@mangayomu/mangascraper';
import Image from 'next/image';
import React from 'react';

interface ListSourceProps {
  src: string;
}

export default function ListSource(props: ListSourceProps) {
  const { src: strSource } = props;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const source = MangaHost.sourcesMap.get(strSource)!;

  return (
    <button className="flex flex-row items-center space-x-2 hover:bg-hover border-2 border-transparent focus:border-primary/[.3] p-1 rounded-lg">
      <div className="relative w-6 h-6">
        <Image
          fill
          src={source.icon}
          loading="lazy"
          alt={`${strSource} icon`}
        />
      </div>
      <Text variant="button">{source.name}</Text>
    </button>
  );
}
