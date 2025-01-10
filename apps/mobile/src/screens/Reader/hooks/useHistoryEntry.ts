import { HistoryEntry } from '@/models/HistoryEntry';
import { LocalManga } from '@/models/LocalManga';
import { Table } from '@/models/schema';
import { useCurrentChapter } from '@/screens/Reader/stores/chapter';
import { Manga } from '@mangayomu/mangascraper';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';

/**
 * Generates a Date object representing the start of tomorrow (midnight).
 *
 * @returns  The Date object set to midnight of the following day.
 */
function generateTodayDate() {
  const r = new Date();
  r.setDate(r.getDate());
  return r.setHours(0, 0, 0, 0);
}

/**
 * Manages the history entry for the current chapter in the reader.
 * This hook retrieves the current chapter using the useCurrentChapter hook,
 * and updates or creates a history entry in the database based on the current chapter's link.
 * If no existing history entry is found for the current chapter, it creates a new one.
 * If a history entry exists, it updates the last updated timestamp.
 *
 * @pre    The useCurrentChapter hook is available and returns a valid chapter object.
 *         The database instance is available and properly configured.
 * @post   A history entry is either updated with the current timestamp or a new entry is created.
 */
export default function useHistoryEntry(manga: Manga) {
  const currentChapter = useCurrentChapter(
    (selector) => selector.currentChapter,
  );

  // Access the database instance.
  const database = useDatabase();

  React.useEffect(() => {
    // Define an asynchronous function to handle changes in the current chapter.
    async function change() {
      // Proceed only if a current chapter is available.
      // Fetch history entries and local mangas from the database.
      const historyEntries = database.get<HistoryEntry>(Table.HISTORY_ENTRIES);

      // Query history entries for the current manga updated before tomorrow.
      const results = await historyEntries.query(
        Q.where('local_manga_link', manga.link),
        Q.and(Q.where('created_at', Q.gte(generateTodayDate()))),
      );

      // If no history entries are found, create a new one.
      if (currentChapter != null) {
        if (results.length === 0) {
          await database.write(async () => {
            await historyEntries.create((model) => {
              model.localChapterLink = currentChapter.link;
              model.localMangaLink = manga.link;
            });
          });
        } else {
          // If a history entry is found, update its last updated timestamp and chapter just in case.
          const [historyEntry] = results;
          await database.write(async () => {
            await historyEntry.update((self) => {
              self.updatedAt = new Date();
              self.localChapterLink = currentChapter.link;
            });
          });
        }
      }
    }
    // Execute the change function whenever the current chapter changes.
    change();
  }, [currentChapter?.link]);
}
