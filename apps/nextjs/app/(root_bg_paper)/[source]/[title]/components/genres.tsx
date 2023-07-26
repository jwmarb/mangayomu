import Genre from '@app/(root_bg_paper)/[source]/[title]/components/genre';
import { MangaHost } from '@mangayomu/mangascraper';
import React from 'react';

interface GenresProps {
  genres: string[];
  source: string;
}

export default function Genres(props: GenresProps) {
  const { genres, source } = props;
  const host = MangaHost.sourcesMap.get(source);
  if (host == null) return null;
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {genres.map((x) => (
        <Genre key={x} genre={host.genresDictionary[x]} />
      ))}
    </div>
  );
}
