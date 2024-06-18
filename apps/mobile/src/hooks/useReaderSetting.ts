import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import useBoolean from '@/hooks/useBoolean';
import useMangaSource from '@/hooks/useMangaSource';
import { Manga } from '@/models/Manga';
import { SettingsState, useSettingsStore } from '@/stores/settings';

/**
 *
 * @param key The name of a reader property
 * @param meta The metadata of the manga to use to change. If not provided, it will default to using reader settings from `useSettingsStore`
 */
export default function useReaderSetting<
  T extends keyof SettingsState['reader'],
>(key: T, manga?: unknown) {
  const globalState = useSettingsStore((store) => store.reader[key]);
  const [localState, setLocalState] = React.useState<
    SettingsState['reader'][T] | null
  >(null);
  const source = useMangaSource({ manga });
  const [loading, toggle] = useBoolean(true);
  const database = useDatabase();

  React.useEffect(() => {
    async function initialize() {
      const dbManga = await Manga.toManga(source.toManga(manga), database);
      const observer = dbManga.observe();
      const subscription = observer.subscribe((model) => {
        toggle(false);
        setLocalState(model[key] as unknown as SettingsState['reader'][T]);
      });
      return () => {
        subscription.unsubscribe();
      };
    }
    initialize();
  }, []);
  return {
    globalState,
    localState,
    isLoading: loading,
  };
}
