import React from 'react';
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { MangaSource } from '@mangayomu/mangascraper';
import Manga from '@/components/composites/Manga';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import useExploreMangas from '@/screens/Home/tabs/Explore/hooks/useExploreMangas';
import { RootStackProps } from '@/screens/navigator';
import { MangaResult, titleMapping } from '@/stores/explore';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import IconButton from '@/components/primitives/IconButton';
import Icon from '@/components/primitives/Icon';
import useBoolean from '@/hooks/useBoolean';
import TextInput from '@/components/primitives/TextInput';
import useUserInput from '@/hooks/useUserInput';
import Text from '@/components/primitives/Text';

const styles = createStyles((theme) => ({
  headerStyle: {
    gap: theme.style.size.s,
  },
  headerLeftStyle: {
    flexGrow: 0,
    flexShrink: 1,
  },
  headerCenterStyle: {
    alignItems: 'flex-start',
  },
  headerRightStyle: {
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

const {
  useColumns,
  getItemLayout,
  ListEmptyComponent: ActualListEmptyComponent,
  renderItem,
  keyExtractor,
  contentContainerStyle,
} = Manga.generateFlatListProps({ flexibleColumns: true });

const ITEMS_PER_PAGE = 30;

export default function ExtendedMangaList(
  props: RootStackProps<'ExtendedMangaList'>,
) {
  const {
    route: {
      params: { type },
    },
  } = props;
  const { data: results } = useExploreMangas();
  const queryClient = useQueryClient();
  const [show, toggle] = useBoolean();
  const mangas = results != null ? results[type].mangas : [];
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { input, setInput } = useUserInput();
  const deferredInput = React.useDeferredValue(input);
  const zeroResults = React.useRef(new Set());
  const searchMapping = React.useRef(new Map<string, MangaResult[]>());
  const queryKey = ['ExtendedMangaList', type, deferredInput];
  const {
    data = { pageParams: [1], pages: [] },
    isFetchedAfterMount,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<
    MangaResult[],
    Error,
    InfiniteData<MangaResult>,
    QueryKey,
    number
  >({
    staleTime: 0,
    queryKey,
    queryFn: ({ pageParam }): MangaResult[] => {
      let filtered = searchMapping.current.get(deferredInput);
      if (filtered == null) {
        filtered = mangas.filter((manga) => {
          const source = MangaSource.getSource(manga.__source__);
          if (source == null)
            throw new Error(`Source ${manga.__source__} does not exist`);
          return source
            .toManga(manga)
            .title.toLowerCase()
            .trim()
            .includes(deferredInput);
        });

        if (filtered.length === 0) {
          for (
            let a = deferredInput;
            a.length > 0;
            a = a.substring(0, a.length - 1)
          ) {
            if (zeroResults.current.has(a)) {
              return [];
            }
          }
          zeroResults.current.add(deferredInput);
          return [];
        } else {
          searchMapping.current.set(deferredInput, filtered);
        }
      }
      return filtered.slice(
        Math.min((pageParam - 1) * ITEMS_PER_PAGE, mangas.length),
        Math.min(pageParam * ITEMS_PER_PAGE, mangas.length),
      );
    },
    initialPageParam: 1,
    getNextPageParam(previous, allPages) {
      if (allPages.length === 0) return 1;
      if (previous.length === 0) return undefined;
      return allPages.length + 1;
    },
    select: (data) => {
      return {
        pageParams: data.pageParams,
        pages: data.pages.flat(),
      };
    },
    networkMode: 'always',
  });
  const columns = useColumns();

  function handleOnShow() {
    toggle(true);
  }

  function handleOnHide() {
    toggle(false);
  }
  const collapsible = useCollapsibleHeader(
    {
      title: titleMapping[type],
      headerLeftStyle: style.headerLeftStyle,
      headerCenterStyle: !show ? style.headerCenterStyle : undefined,
      headerStyle: style.headerStyle,
      headerRightStyle: style.headerRightStyle,
      headerCenter: show ? (
        <TextInput
          onChangeText={setInput}
          defaultValue={input}
          iconButton
          icon={
            <IconButton
              icon={<Icon type="icon" name="arrow-left" />}
              onPress={handleOnHide}
              size="small"
            />
          }
        />
      ) : undefined,
      showHeaderLeft: !show,
      showHeaderRight: !show,
      headerRight: (
        <IconButton
          icon={<Icon type="icon" name="magnify" />}
          onPress={handleOnShow}
        />
      ),
    },
    [show],
  );
  React.useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey });
    };
  }, []);

  function handleOnEndReached() {
    if (data != null && hasNextPage && isFetchedAfterMount) {
      fetchNextPage();
    }
  }

  function ListEmptyComponent() {
    if (!isFetching && data.pages.length === 0)
      return (
        <Text color="textSecondary">
          No results found for "<Text bold>{input}</Text>"
        </Text>
      );
    return <ActualListEmptyComponent />;
  }

  return (
    <Screen.FlatList
      onEndReached={handleOnEndReached}
      onEndReachedThreshold={1}
      initialNumToRender={12}
      maxToRenderPerBatch={9}
      updateCellsBatchingPeriod={1000}
      contentContainerStyle={contentContainerStyle}
      key={columns}
      numColumns={columns}
      collapsible={collapsible}
      data={data.pages}
      ListEmptyComponent={ListEmptyComponent}
      getItemLayout={getItemLayout}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
}
