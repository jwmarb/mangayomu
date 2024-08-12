import { PageProps } from '@/screens/Reader/components/ui/Page';
import { MangaChapter } from '@mangayomu/mangascraper';
import React from 'react';

export default function useChapterData(
  currentPage: PageProps | null,
  currentChapter: MangaChapter,
) {
  React.useEffect(() => {
    // Note: `currentPage` can be null when the user has not loaded the chapter yet
    if (currentPage != null) {
      console.log(currentChapter.name, 'Page ' + currentPage?.page);
    }
  }, [currentPage, currentChapter]);
}
