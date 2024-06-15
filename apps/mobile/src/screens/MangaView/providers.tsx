import React from 'react';
import BottomSheet from '@/components/composites/BottomSheet';
import useManga from '@/hooks/useManga';
import useMangaSource from '@/hooks/useMangaSource';
import {
  MangaViewChaptersContext,
  MangaViewDataContext,
  MangaViewErrorContext,
  MangaViewFetchStatusContext,
  MangaViewMangaContext,
  MangaViewMangaSourceContext,
  MangaViewOpenFilterMenuContext,
  MangaViewUnparsedDataContext,
  MangaViewUnparsedMangaContext,
} from '@/screens/MangaView/context';
import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';

type MangaViewProvidersProps = {
  unparsedManga: unknown;
  source?: string;
  chapters: unknown[];
  bottomSheet: React.RefObject<BottomSheet>;
} & React.PropsWithChildren;

export default function MangaViewProvider(props: MangaViewProvidersProps) {
  const {
    source: sourceStr,
    unparsedManga,
    children,
    chapters,
    bottomSheet,
  } = props;
  const source = useMangaSource({ manga: unparsedManga, source: sourceStr });
  const manga = useManga(unparsedManga, source);
  const { data, error, fetchStatus } = useMangaMeta(unparsedManga, sourceStr);
  const meta = data?.[1];
  const unparsed = data?.[0];

  const openFilterMenu = React.useCallback(() => {
    bottomSheet.current?.open();
  }, []);

  return (
    <MangaViewChaptersContext.Provider value={chapters}>
      <MangaViewUnparsedDataContext.Provider value={unparsed}>
        <MangaViewOpenFilterMenuContext.Provider value={openFilterMenu}>
          <MangaViewMangaContext.Provider value={manga}>
            <MangaViewDataContext.Provider value={meta}>
              <MangaViewErrorContext.Provider value={error}>
                <MangaViewFetchStatusContext.Provider value={fetchStatus}>
                  <MangaViewMangaSourceContext.Provider value={source}>
                    <MangaViewUnparsedMangaContext.Provider
                      value={unparsedManga}
                    >
                      {children}
                    </MangaViewUnparsedMangaContext.Provider>
                  </MangaViewMangaSourceContext.Provider>
                </MangaViewFetchStatusContext.Provider>
              </MangaViewErrorContext.Provider>
            </MangaViewDataContext.Provider>
          </MangaViewMangaContext.Provider>
        </MangaViewOpenFilterMenuContext.Provider>
      </MangaViewUnparsedDataContext.Provider>
    </MangaViewChaptersContext.Provider>
  );
}
