import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import useManga from '@/hooks/useManga';
import useMangaSource from '@/hooks/useMangaSource';
import { RootStackProps } from '@/screens/navigator';
import { styles } from '@/screens/MangaView/styles';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import {
  MangaViewDataContext,
  MangaViewErrorContext,
  MangaViewFetchStatusContext,
  MangaViewMangaContext,
  MangaViewMangaSourceContext,
} from '@/screens/MangaView/context';
import ListHeaderComponent from '@/screens/MangaView/header';

const renderItem = () => null;

export default function MangaView(props: RootStackProps<'MangaView'>) {
  const {
    route: {
      params: { manga: unparsedManga, source: sourceStr },
    },
  } = props;
  const source = useMangaSource({ manga: unparsedManga, source: sourceStr });
  const manga = useManga(unparsedManga, source);
  const { data, status, error } = useQuery({
    queryKey: [manga.link],
    queryFn: ({ signal }) => source.meta(manga, signal),
    select: (data) => source.toMangaMeta(data),
  });
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const collapsible = useCollapsibleHeader({
    showHeaderCenter: false,
    headerRightStyle: style.headerRight,
    headerRight: (
      <>
        <IconButton icon={<Icon type="icon" name="bookmark-outline" />} />
        <IconButton icon={<Icon type="icon" name="web" />} />
      </>
    ),
  });

  return (
    <MangaViewMangaContext.Provider value={manga}>
      <MangaViewDataContext.Provider value={data}>
        <MangaViewErrorContext.Provider value={error}>
          <MangaViewFetchStatusContext.Provider value={status}>
            <MangaViewMangaSourceContext.Provider value={source}>
              <Screen.FlatList
                ignoreHeaderOffset
                ListHeaderComponent={ListHeaderComponent}
                collapsible={collapsible}
                data={data?.chapters}
                renderItem={renderItem}
              />
            </MangaViewMangaSourceContext.Provider>
          </MangaViewFetchStatusContext.Provider>
        </MangaViewErrorContext.Provider>
      </MangaViewDataContext.Provider>
    </MangaViewMangaContext.Provider>
  );
}
