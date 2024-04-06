import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ListRenderItem } from 'react-native';
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
import Chapter, {
  BASE_CHAPTER_HEIGHT,
  CHAPTER_HEIGHT_EXTENDED,
} from '@/screens/MangaView/components/primitives/Chapter';
import headerLeft from '@/screens/MangaView/components/header/headerLeft';
import headerRight from '@/screens/MangaView/components/header/headerRight';

const renderItem: ListRenderItem<unknown> = ({ item }) => (
  <Chapter chapter={item} />
);

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
    showBackButton: false,
    headerRightStyle: style.headerRight,
    headerLeft,
    headerRight,
  });

  const keyExtractor = React.useCallback(
    (chapter: unknown) => source.toChapter(chapter, data).link,
    [source, data],
  );

  const layoutSize = React.useRef<number>(0);

  const getItemLayout = React.useCallback(
    (
      element: ArrayLike<unknown> | null | undefined,
      index: number,
    ): {
      length: number;
      offset: number;
      index: number;
    } => {
      if (element == null)
        return {
          length: 0,
          offset: 0,
          index,
        };
      const length = source.toChapter(element[index], data).subname
        ? CHAPTER_HEIGHT_EXTENDED
        : BASE_CHAPTER_HEIGHT;
      const offset = layoutSize.current;
      layoutSize.current += length;
      return {
        length,
        offset,
        index,
      };
    },
    [data],
  );

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
                getItemLayout={getItemLayout}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={style.contentContainerStyle}
              />
            </MangaViewMangaSourceContext.Provider>
          </MangaViewFetchStatusContext.Provider>
        </MangaViewErrorContext.Provider>
      </MangaViewDataContext.Provider>
    </MangaViewMangaContext.Provider>
  );
}
