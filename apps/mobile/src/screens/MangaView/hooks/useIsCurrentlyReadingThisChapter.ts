import { Manga } from '@/models/Manga';
import { Manga as MManga } from '@mangayomu/mangascraper';
import { Table } from '@/models/schema';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { Q } from '@nozbe/watermelondb';
import { useFocusEffect } from '@react-navigation/native';

export default function useIsCurrentlyReadingThisChapter(
  manga: MManga,
  chapterId?: string,
) {
  const database = useDatabase();
  const [state, setState] = React.useState<boolean>();

  useFocusEffect(
    React.useCallback(() => {
      async function initialize() {
        const observer = database
          .get<Manga>(Table.MANGAS)
          .query(Q.where('link', manga.link))
          .observe();
        const subscription = observer.subscribe((results) => {
          if (results.length > 0) {
            const [foundManga] = results;
            setState(foundManga.currentlyReadingChapter?.id === chapterId);
          }
        });
        return () => {
          subscription.unsubscribe();
        };
      }
      initialize();
    }, [chapterId]),
  );

  return state;
}
