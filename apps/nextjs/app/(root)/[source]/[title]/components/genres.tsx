import Genre from './genre';
import Text from '@app/components/Text';
import { MangaHost } from '@mangayomu/mangascraper';
import React from 'react';

interface GenresProps {
  genres?: string[] | null;
  source: string;
}

export default function Genres(props: GenresProps) {
  const { genres, source } = props;
  const host = MangaHost.sourcesMap.get(source);
  if (host == null) return null;

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {genres
        ? genres.map((x) => <Genre key={x} genre={host.genresDictionary[x]} />)
        : ['Action', 'Adventure', 'Comedy', 'Drama', 'Romance'].map((x) => (
            <button
              key={x}
              className="bg-tag px-3 py-1.5 rounded-full hover:bg-hoverduration-250 transition focus:bg-hover focus:outline focus:outline-2 focus:outline-primary/[.3]"
            >
              <Text.Skeleton
                className="font-normal text-sm tracking-tight"
                text={[x]}
              />
            </button>
          ))}
    </div>
  );
}
