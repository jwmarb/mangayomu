import { Chapter } from '@/models/Chapter';
import { Manga } from '@/models/Manga';
import { PageProps } from '@/screens/Reader/components/ui/Page';
import { PageBoundaries } from '@/screens/Reader/helpers/determinePageBoundaries';
import { getPageCount } from '@/screens/Reader/hooks/useMetrics';
import { Manga as MManga, MangaChapter } from '@mangayomu/mangascraper';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';

export default function useChapterData(
  currentPage: PageProps | null,
  currentChapter: MangaChapter,
  manga: MManga,
  boundaries: React.MutableRefObject<PageBoundaries>,
  initialPageParam: number,
) {
  const database = useDatabase();

  const [initialPage, setInitialPage] = React.useState<number | null>(null);

  React.useEffect(() => {
    async function init() {
      try {
        const foundChapter = await Chapter.toChapter(currentChapter, database);
        // formula: initialPage = (currentPage - 1) + initialPageParam
        setInitialPage(
          foundChapter.currentPage + (initialPageParam === 0 ? -1 : 0),
        );
      } catch (e) {
        // will fallback here because `Chapter` doesnt exist
        setInitialPage(initialPageParam === 0 ? 0 : 1);
      }
    }
    init();
  }, []);

  React.useEffect(() => {
    async function init() {
      // Note: `currentPage` can be null when the user has not loaded the chapter yet
      if (currentPage != null) {
        const totalPageCount = getPageCount(currentChapter.link, boundaries);
        const foundChapter = await Chapter.toChapter(currentChapter, database, {
          currentPage: currentPage.page,
          pagesCount: totalPageCount,
          scrollPosition: 0,
        });
        const foundManga = await Manga.toManga(manga, database);

        await database.write(async () => {
          await Promise.all([
            foundChapter.update((self) => {
              self.currentPage = currentPage.page;
            }),
            foundManga.update((self) => {
              self.currentlyReadingChapter?.set(foundChapter);
            }),
          ]);
        });
      }
    }
    init();
  }, [currentPage?.page, currentChapter.link]);

  return { initialScrollIndex: initialPage };
}
