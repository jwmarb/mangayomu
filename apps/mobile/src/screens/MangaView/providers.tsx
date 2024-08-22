import React from 'react';
import BottomSheet from '@/components/composites/BottomSheet';
import useManga from '@/hooks/useManga';
import useMangaSource from '@/hooks/useMangaSource';
import {
  MangaViewChaptersProvider,
  MangaViewDataProvider,
  MangaViewErrorProvider,
  MangaViewFetchStatusProvider,
  MangaViewMangaProvider,
  MangaViewMangaSourceProvider,
  MangaViewOpenFilterMenuProvider,
  MangaViewUnparsedDataProvider,
  MangaViewUnparsedMangaProvider,
} from '@/screens/MangaView/context';
import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';
import { Manga } from '@/models/Manga';

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
    <MangaViewChaptersProvider value={chapters}>
      <MangaViewUnparsedDataProvider value={unparsed}>
        <MangaViewOpenFilterMenuProvider value={openFilterMenu}>
          <MangaViewMangaProvider value={manga}>
            <MangaViewDataProvider value={meta}>
              <MangaViewErrorProvider value={error}>
                <MangaViewFetchStatusProvider value={fetchStatus}>
                  <MangaViewMangaSourceProvider value={source}>
                    <MangaViewUnparsedMangaProvider value={unparsedManga}>
                      {children}
                    </MangaViewUnparsedMangaProvider>
                  </MangaViewMangaSourceProvider>
                </MangaViewFetchStatusProvider>
              </MangaViewErrorProvider>
            </MangaViewDataProvider>
          </MangaViewMangaProvider>
        </MangaViewOpenFilterMenuProvider>
      </MangaViewUnparsedDataProvider>
    </MangaViewChaptersProvider>
  );
}
