import { useLocalRealm, useRealm } from '@database/main';
import { MangaSchema, UseMangaOptions } from '@database/schemas/Manga';
import writeChapters from '@database/schemas/Manga/writeChapters';
import writeManga from '@database/schemas/Manga/writeManga';
import assertIsManga from '@helpers/assertIsManga';
import displayMessage from '@helpers/displayMessage';
import { getErrorMessage } from '@helpers/getErrorMessage';
import useMangaSource from '@hooks/useMangaSource';
import { Manga } from '@mangayomu/mangascraper/src';
import NetInfo from '@react-native-community/netinfo';
import { useUser } from '@realm/react';
import React from 'react';
import { InteractionManager } from 'react-native';

export type FetchMangaMetaStatus = 'loading' | 'success' | 'local' | 'error';

interface FetchMangaState {
  error: string;
  isOffline: boolean | null;
  status: FetchMangaMetaStatus;
}

export default function useFetchManga(
  options: UseMangaOptions,
  link: string | Manga | MangaSchema,
) {
  const realm = useRealm();
  const localRealm = useLocalRealm();
  const source = typeof link !== 'string' ? useMangaSource(link) : null;
  const user = useUser();
  const [state, _setState] = React.useState<FetchMangaState>({
    error: '',
    isOffline: null,
    status: options.preferLocal ? 'local' : 'loading',
  });
  const setState = React.useCallback(
    (
      draft:
        | Partial<FetchMangaState>
        | ((state: FetchMangaState) => Partial<FetchMangaState>),
    ) => {
      _setState((prev) => {
        const parsed = typeof draft === 'function' ? draft(prev) : draft;
        const newState = { ...prev };
        for (const k in newState) {
          const key = k as keyof FetchMangaState;
          if (key in parsed && parsed[key] != null)
            (newState[key] as unknown) = parsed[key];
        }
        return newState;
      });
    },
    [_setState],
  );

  React.useEffect(() => {
    const netListener = NetInfo.addEventListener((state) => {
      setState((prev) => ({
        isOffline: state.isInternetReachable === false,
        ...(state.isInternetReachable === false
          ? {
              status: prev.status === 'loading' ? 'error' : 'local',
            }
          : {}),
      }));
    });
    return () => {
      netListener();
    };
  }, []);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      if (state.isOffline === false) {
        try {
          await fetchData();
          setState({
            status: 'success',
          });
        } catch (e) {
          setState({
            status: 'error',
            error: getErrorMessage(e),
          });
        }
      }
    });
  }, [state.isOffline]);

  const fetchData = React.useCallback(async () => {
    if (!options.preferLocal) {
      if (state.isOffline) {
        displayMessage('You are offline.');
        return;
      }
      if (typeof link === 'string')
        throw Error(
          `"${link}" does not exist in the realm and is being called upon when it is undefined. Use type Manga instead of type string.`,
        );
      if (source == null)
        throw Error(
          `"${
            link.source
          }" is not a valid source. Cannot fetch manga metadata from ${
            assertIsManga(link) ? link.link : link._id
          }.`,
        );
      const _manga = link;
      setState({
        status: 'loading',
        error: '',
      });
      try {
        const meta = await source.getMeta(
          assertIsManga(_manga)
            ? _manga
            : {
                link: _manga._id,
                imageCover: _manga.imageCover,
                title: _manga.title,
                source: _manga.source,
              },
        );

        const { chapters, availableLanguages } = writeChapters(
          localRealm,
          meta,
        );
        writeManga(realm, localRealm, meta, user, chapters, availableLanguages);
      } catch (e) {
        console.error(e);
        throw Error(getErrorMessage(e));
      }
    }
  }, [
    options.preferLocal,
    link,
    setState,
    source,
    realm,
    state.isOffline,
    realm,
    user,
  ]);

  return { state, setState, fetchData };
}
