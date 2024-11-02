import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { Manga as MManga } from '@mangayomu/mangascraper';
import { Database } from '@nozbe/watermelondb';
import useBoolean from '@/hooks/useBoolean';
import { Manga } from '@/models/Manga';
import {
  ReaderSettingsState,
  SettingsState,
  useSettingsStore,
} from '@/stores/settings';
import { globalSetting } from '@/models/schema';

type InitOptions = {
  database: Database;
  dbManga: React.MutableRefObject<Manga | undefined>;
  manga: MManga;
  onSubscription: (model: Manga) => void;
};

/**
 * Initializes a Manga object with the provided options.
 *
 * @param {InitOptions} options - The initialization options.
 * @param {Database} options.database - The WatermelonDB database instance.
 * @param {React.MutableRefObject<Manga | undefined>} options.dbManga - A mutable reference to store the initialized Manga object.
 * @param {MManga} options.manga - The Manga object to be initialized.
 * @param {(model: Manga) => void} options.onSubscription - A callback function to handle subscription events.
 * @returns {() => void} A cleanup function to unsubscribe from the observer.
 */
export async function initialize({
  database,
  manga,
  onSubscription,
  dbManga: ref,
}: InitOptions) {
  const dbManga = await Manga.toManga(manga, database);
  ref.current = dbManga;
  const observer = dbManga.observe();
  const subscription = observer.subscribe(onSubscription);
  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Retrieves a reader setting locally (from the manga) or globally (global applies to all mangas by default).
 *
 * @param {string} key - The name of the reader property.
 * @param {MManga} meta - The metadata of the manga. If not provided, it will use settings from `useSettingsStore`.
 * @returns {any} The value of the specified reader setting.
 */
export default function useReaderSetting<T extends keyof ReaderSettingsState>(
  key: T,
  manga?: MManga,
) {
  // Get global state from the settings store
  const globalState = useSettingsStore((store) => store.reader[key]);

  // Function to set global state in the settings store
  const setGlobalState = useSettingsStore((store) => store.setReaderState);

  // Local state for storing the manga's specific setting
  const [localState, setLocalState] = React.useState<
    ReaderSettingsState[T] | null
  >(null);

  // Reference to store the Manga object
  const dbManga = React.useRef<Manga>();

  // Boolean state to track loading status
  const [loading, toggle] = useBoolean(true);

  // Get the WatermelonDB database instance
  const database = useDatabase();
  const setState = React.useCallback(
    async (newValue: ReaderSettingsState[T]) => {
      if (manga != null) {
        await database.write(async () => {
          await dbManga.current?.update((self) => {
            // Update the manga's specific setting with the new value
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            self[key] = newValue as any;
          });
        });
      } else {
        if (newValue === globalSetting) {
          console.warn(
            `Tried setting a global setting named "${key}" to "Use global setting" option, which is not allowed`,
          );
          return;
        }
        // Update the global state in the settings store
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setGlobalState(key, newValue as any);
      }
    },
    [],
  );

  // Effect hook to initialize or subscribe to manga's specific setting
  React.useEffect(() => {
    if (manga != null) {
      initialize({
        dbManga,
        database,
        manga,
        onSubscription: (model) => {
          toggle(false);
          setLocalState(model[key]);
        },
      });
    } else {
      toggle(false);
    }
  }, []);

  // Return the reader setting values and functions
  return {
    globalState,
    localState,
    setState,
    state:
      localState == null
        ? globalState
        : localState === globalSetting
          ? globalState
          : localState,
    isLoading: loading,
  };
}
