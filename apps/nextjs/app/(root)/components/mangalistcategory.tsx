import Book from '@app/components/Book';
import { ExploreCategory, useExploreStore } from '@app/context/explore';
import { Manga } from '@mangayomu/mangascraper';
import React from 'react';
import { shallow } from 'zustand/shallow';

interface MangaListCategoryProps {
  category: ExploreCategory;
}

export default function MangaListCategory(props: MangaListCategoryProps) {
  const { category } = props;
  const state = useExploreStore(
    (store) => ({
      state: store.state[category],
      mangas: store.mangas[category],
      errors: store.errors[category],
    }),
    shallow,
  );

  return (
    <div className="flex justify-center flex-shrink flex-row flex-wrap">
      {state.state === 'loading'
        ? new Array(9).fill('').map((_, i) => <Book.Skeleton key={i} />)
        : unique(state.mangas)
            .slice(0, 9)
            .map((x, i) => <Book key={x.link + i} manga={x} />)}
    </div>
  );
}

function unique(mangas: Manga[]) {
  const p = new Set();
  return mangas.filter((manga) => {
    if (!p.has(manga.link)) {
      p.add(manga.link);
      return true;
    }
    return false;
  });
}
