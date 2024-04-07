import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ListRenderItem } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import {
  compose,
  useDatabase,
  withDatabase,
  withObservables,
} from '@nozbe/watermelondb/react';
import { Database, Model, Q } from '@nozbe/watermelondb';
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
  MangaViewOpenFilterMenuContext,
} from '@/screens/MangaView/context';
import ListHeaderComponent from '@/screens/MangaView/details';
import Chapter from '@/screens/MangaView/components/primitives/Chapter';
import headerLeft from '@/screens/MangaView/components/header/headerLeft';
import headerRight from '@/screens/MangaView/components/header/headerRight';
import useItemLayout from '@/screens/MangaView/hooks/useItemLayout';
import BottomSheet from '@/components/composites/BottomSheet';
import Text from '@/components/primitives/Text';
import { Table } from '@/models/schema';
import { LocalManga } from '@/models/LocalManga';
import { LocalChapter } from '@/models/LocalChapter';
import { isChapter } from '@/utils/helpers';
import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';

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
  const { data, status, error, isFetching, refetch } = useMangaMeta(props);
  const bottomSheet = React.useRef<BottomSheet>(null);
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const collapsible = useCollapsibleHeader(
    {
      showHeaderCenter: false,
      showBackButton: false,
      headerRightStyle: style.headerRight,
      headerLeft,
      headerRight,
      loading: isFetching,
    },
    [isFetching],
  );

  const openFilterMenu = React.useCallback(() => {
    bottomSheet.current?.open();
  }, []);

  const keyExtractor = React.useCallback(
    (chapter: unknown) =>
      isChapter(chapter) ? chapter.link : source.toChapter(chapter, data).link,
    [source, data],
  );

  const getItemLayout = useItemLayout(source, data);

  return (
    <MangaViewOpenFilterMenuContext.Provider value={openFilterMenu}>
      <MangaViewMangaContext.Provider value={manga}>
        <MangaViewDataContext.Provider value={data}>
          <MangaViewErrorContext.Provider value={error}>
            <MangaViewFetchStatusContext.Provider value={status}>
              <MangaViewMangaSourceContext.Provider value={source}>
                <Screen.FlatList
                  refreshing={isFetching}
                  refreshControl={
                    <RefreshControl
                      refreshing={isFetching}
                      onRefresh={refetch}
                    />
                  }
                  ignoreHeaderOffset
                  ListHeaderComponent={ListHeaderComponent}
                  collapsible={collapsible}
                  data={data?.chapters}
                  getItemLayout={getItemLayout}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  windowSize={7}
                  maxToRenderPerBatch={13}
                  contentContainerStyle={style.contentContainerStyle}
                />
                <BottomSheet ref={bottomSheet}>
                  <BottomSheetView>
                    <Text>Hello World!</Text>
                  </BottomSheetView>
                </BottomSheet>
              </MangaViewMangaSourceContext.Provider>
            </MangaViewFetchStatusContext.Provider>
          </MangaViewErrorContext.Provider>
        </MangaViewDataContext.Provider>
      </MangaViewMangaContext.Provider>
    </MangaViewOpenFilterMenuContext.Provider>
  );
}
