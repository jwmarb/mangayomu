import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { Manga as MManga } from '@mangayomu/mangascraper';
import { Database } from '@nozbe/watermelondb';
import useBoolean from '@/hooks/useBoolean';
import { Manga } from '@/models/Manga';
import { SettingsState, useSettingsStore } from '@/stores/settings';

type InitOptions = {
  database: Database;
  dbManga: React.MutableRefObject<Manga | undefined>;
  manga: MManga;
  onSubscription: (model: Manga) => void;
};

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
 *
 * @param key The name of a reader property
 * @param meta The metadata of the manga to use to change. If not provided, it will default to using reader settings from `useSettingsStore`
 */
export default function useReaderSetting<
  T extends keyof SettingsState['reader'],
>(key: T, manga?: MManga) {
  const globalState = useSettingsStore((store) => store.reader[key]);
  const setGlobalState = useSettingsStore((store) => store.setReaderState);
  const [localState, setLocalState] = React.useState<
    SettingsState['reader'][T] | null
  >(null);
  const dbManga = React.useRef<Manga>();
  const [loading, toggle] = useBoolean(true);
  const database = useDatabase();
  const setState = React.useCallback(
    async (newValue: SettingsState['reader'][T]) => {
      if (manga != null) {
        await database.write(async () => {
          await dbManga.current?.update((self) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            self[key] = newValue as any;
          });
        });
      } else {
        setGlobalState(key, newValue);
      }
    },
    [],
  );

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
  return {
    globalState,
    localState,
    setState,
    isLoading: loading,
  };
}
