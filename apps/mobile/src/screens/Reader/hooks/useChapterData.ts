import { Chapter } from '@/models/Chapter';
import { Manga } from '@/models/Manga';
import { PageProps } from '@/screens/Reader/components/ui/Page';
import ExtraReaderInfo from '@/screens/Reader/helpers/ExtraReaderInfo';
import { useCurrentChapter } from '@/screens/Reader/stores/chapter';
import { Manga as MManga } from '@mangayomu/mangascraper';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';

/**
 *  Manages and retrieves chapter data for the reader screen, initializing the initial page
 *  based on the current chapter and manga data. It updates the chapter's current page and
 *  the manga's currently reading chapter in the database.
 *
 *  @pre    currentPage is either a PageProps object or null; manga is a valid MManga object.
 *          currentChapter is available and not null.
 *  @post   initialPage is set based on the current chapter's page and the initial page parameter.
 *          The chapter's current page and the manga's currently reading chapter are updated in the database.
 *  @param currentPage    the current page properties or null if not loaded yet.
 *  @param manga          the manga object representing the manga being read.
 *
 *  @returns  An object containing the initial scroll index (initialPage) for the reader.
 */
export default function useChapterData(
  currentPage: PageProps | null,
  manga: MManga,
) {
  const database = useDatabase();
  const currentChapter = useCurrentChapter(
    (selector) => selector.currentChapter,
  );

  const [initialPage, setInitialPage] = React.useState<number | null>(null);

  React.useEffect(() => {
    async function init() {
      try {
        const foundChapter = await Chapter.toChapter(currentChapter!, database);
        // formula: initialPage = (currentPage - 1) + initialPageParam
        setInitialPage(
          foundChapter.currentPage +
            (ExtraReaderInfo.getInitialPageParam() === 0 ? -1 : 0),
        );
      } catch (e) {
        // will fallback here because `Chapter` doesnt exist
        setInitialPage(ExtraReaderInfo.getInitialPageParam() === 0 ? 0 : 1);
      }
    }
    init();
  }, [currentChapter != null]);

  React.useEffect(() => {
    async function init() {
      // Note: `currentPage` can be null when the user has not loaded the chapter yet
      if (currentPage != null && currentChapter != null) {
        const totalPageCount = ExtraReaderInfo.getNumOfPages(currentChapter);
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
  }, [currentPage?.page, currentChapter?.link]);

  return { initialScrollIndex: initialPage };
}
