'use client';
import Book from '@app/components/Book';
import { ExploreCategory, useExploreStore } from '@app/context/explore';
import { Manga } from '@mangayomu/mangascraper';
import React from 'react';

interface MangaListCategoryProps {
  category: ExploreCategory;
  limitless?: boolean;
  query?: string;
}

const defaultArr: Manga[] = [];

export default function MangaListCategory(props: MangaListCategoryProps) {
  const { category, limitless = false, query = '' } = props;
  const isLoading = useExploreStore(
    (store) => store.state[category] === 'loading',
  );
  const mangas = useExploreStore(
    (store) => store.mangas[category] ?? defaultArr,
  );

  const uniqMangas = React.useDeferredValue(unique(mangas, query));

  if (limitless) {
    if (isLoading)
      return (
        <div className="flex justify-center flex-shrink flex-row flex-wrap">
          {new Array(30).fill('').map((_, i) => (
            <Book.Skeleton key={i} />
          ))}
        </div>
      );

    return (
      <div className="flex justify-center flex-shrink flex-row flex-wrap">
        {uniqMangas.map((x) => (
          <Book key={x.link} manga={x} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-shrink flex-row flex-wrap">
      {isLoading
        ? new Array(9).fill('').map((_, i) => <Book.Skeleton key={i} />)
        : uniqMangas.slice(0, 9).map((x) => <Book key={x.link} manga={x} />)}
    </div>
  );
}

function unique(mangas: Manga[], query: string) {
  const p = new Set();
  const parsed = query.trim().toLowerCase();
  return mangas.filter((manga) => {
    if (!p.has(manga.link)) {
      p.add(manga.link);
      if (manga.title.trim().toLowerCase().includes(parsed)) return true;
      return false;
    }
    return false;
  });
}
