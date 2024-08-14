import { Chapter } from '@/models/Chapter';
import { Table } from '@/models/schema';
import { MangaChapter } from '@mangayomu/mangascraper';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

export default function useChapterInfo(chapter: MangaChapter) {
  const database = useDatabase();
  const [state, setState] =
    React.useState<Pick<Chapter, 'id' | 'pagesCount' | 'currentPage'>>();

  useFocusEffect(
    React.useCallback(() => {
      async function initialize() {
        const observer = database
          .get<Chapter>(Table.CHAPTERS)
          .query(Q.where('link', chapter.link))
          .observe();
        const subscription = observer.subscribe((results) => {
          if (results.length > 0) {
            const [foundChapter] = results;
            setState((prev) => {
              const { id, currentPage, pagesCount } = foundChapter;
              if (
                prev?.currentPage !== currentPage &&
                prev?.id !== id &&
                prev?.pagesCount !== pagesCount
              ) {
                return {
                  id,
                  currentPage,
                  pagesCount,
                };
              }
              return prev;
            });
          }
        });
        return () => {
          subscription.unsubscribe();
        };
      }
      initialize();
    }, []),
  );

  return state;
}
