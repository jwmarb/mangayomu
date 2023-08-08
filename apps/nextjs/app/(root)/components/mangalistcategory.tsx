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

  const mangas = useUniqueFiltered(category, query);

  if (isLoading)
    return (
      <div className="flex justify-center flex-shrink flex-row flex-wrap">
        {new Array(limitless ? 30 : 9).fill(null).map((_, i) => (
          <Book.Skeleton key={i} />
        ))}
      </div>
    );

  if (limitless) {
    return <Book.List list={mangas} />;
  }

  return <Book.List list={mangas.slice(0, 9)} />;
}

function useUniqueFiltered(category: 'trending' | 'recent', query: string) {
  const mangas = useExploreStore(
    (store) => store.mangas[category] ?? defaultArr,
  );

  return React.useMemo(() => {
    const p = new Set<string>();
    const parsed = query.toLowerCase().trim();
    return mangas.filter((manga) => {
      if (!p.has(manga.link)) {
        p.add(manga.link);
        return manga.title.trim().toLowerCase().includes(parsed);
      }

      return false;
    });
  }, [mangas, query]);
}
