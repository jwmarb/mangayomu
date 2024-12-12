import { HistoryEntry } from '@/models/HistoryEntry';
import { LocalManga } from '@/models/LocalManga';
import { Table } from '@/models/schema';
import { useCurrentChapter } from '@/screens/Reader/stores/chapter';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';

/**
 * Generates a Date object representing the start of tomorrow (midnight).
 *
 * @returns  The Date object set to midnight of the following day.
 */
function generateTomorrowDate() {
  const r = new Date();
  r.setDate(r.getDate() + 1);
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
export default function useHistoryEntry() {
  // Retrieve the current chapter using the useCurrentChapter hook.
  const currentChapter = useCurrentChapter(
    (selector) => selector.currentChapter,
  );

  // Access the database instance.
  const database = useDatabase();

  React.useEffect(() => {
    // Define an asynchronous function to handle changes in the current chapter.
    async function change() {
      // Proceed only if a current chapter is available.
      if (currentChapter != null) {
        // Fetch history entries and local mangas from the database.
        const historyEntries = database.get<HistoryEntry>(
          Table.HISTORY_ENTRIES,
        );
        const localMangas = database.get<LocalManga>(Table.LOCAL_MANGAS);

        // Query history entries for the current chapter link updated before tomorrow.
        const results = await historyEntries.query(
          Q.where('local_chapter_link', currentChapter.link),
          Q.and(Q.where('updated_at', Q.lt(generateTomorrowDate()))),
        );

        // If no history entries are found, create a new one.
        if (results.length === 0) {
          await database.write(async () => {
            // Find the local manga associated with the current chapter.
            const foundLocalMangas = await localMangas.query(
              Q.on(Table.LOCAL_CHAPTERS, 'link', currentChapter.link),
            );
            if (foundLocalMangas.length > 0) {
              const [localManga] = foundLocalMangas;
              // Create a new history entry linking the current chapter and manga.
              return await historyEntries.create((model) => {
                model.localChapterLink = currentChapter.link;
                model.localMangaLink = localManga.link;
              });
            } else {
              // Log an error if no local manga or chapter is found.
              console.error(
                "Couldn't find either a local manga or local chapter. Data will not be persisted.",
              );
            }
          });
        } else {
          // If a history entry is found, update its last updated timestamp.
          const [historyEntry] = results;
          await database.write(async () => {
            await historyEntry.update((self) => {
              self.updatedAt = new Date();
            });
          });
        }
      }
    }
    // Execute the change function whenever the current chapter changes.
    change();
  }, [currentChapter]);
}
