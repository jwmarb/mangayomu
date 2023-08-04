import useBoolean from '@hooks/useBoolean';
import useChapterFetcher from '@screens/Reader/hooks/useChapterFetcher';
import NetInfo from '@react-native-community/netinfo';
import React from 'react';
import { Page, TransitionPage, fetchedChapters } from '@redux/slices/reader';
import { useLocalRealm } from '@database/main';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';
type Abortable = ReturnType<ReturnType<typeof useChapterFetcher>>;

export default function useCancellable() {
  const localRealm = useLocalRealm();
  const [previous, togglePrevious] = useBoolean();
  const [next, toggleNext] = useBoolean();
  const nextFnRef = React.useRef<() => Abortable>();
  const prevFnRef = React.useRef<() => Abortable>();
  React.useEffect(() => {
    if (previous && prevFnRef.current) {
      let p: Abortable;
      const listener = NetInfo.addEventListener(() => {
        p?.abort();
        if (prevFnRef.current != null) {
          p = prevFnRef.current();
          p?.finally(() => {
            prevFnRef.current = undefined;
            setTimeout(() => togglePrevious(false), 1);
          });
        }
      });

      return () => {
        listener();
        p?.abort();
      };
    }
  }, [previous]);

  React.useEffect(() => {
    if (next && nextFnRef.current) {
      let p: Abortable;
      const listener = NetInfo.addEventListener(() => {
        p?.abort();
        if (nextFnRef.current != null) {
          p = nextFnRef.current();
          p?.finally(() => {
            toggleNext(false);
            nextFnRef.current = undefined;
          });
        }
      });

      return () => {
        listener();
        p?.abort();
      };
    }
  }, [next]);
  const cancellable = (
    fetchPages: ReturnType<typeof useChapterFetcher>,
    state: Omit<TransitionPage, 'type'>,
  ) => {
    const next = localRealm.objectForPrimaryKey(
      LocalChapterSchema,
      state.next._id,
    );
    const previous = localRealm.objectForPrimaryKey(
      LocalChapterSchema,
      state.previous._id,
    );
    if (previous == null || next == null) return;

    if (fetchedChapters.has(next._id) && !fetchedChapters.has(previous._id)) {
      prevFnRef.current = () => fetchPages(previous);
      togglePrevious(true);
    }
    if (fetchedChapters.has(previous._id) && !fetchedChapters.has(next._id)) {
      nextFnRef.current = () => fetchPages(next);
      toggleNext(true);
    }
  };
  return [cancellable, previous] as const;
}
