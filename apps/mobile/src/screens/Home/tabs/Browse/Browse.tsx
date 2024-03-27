import { ListRenderItem } from 'react-native';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { TextInput as NativeTextInput } from 'react-native-gesture-handler';
import {
  InfiniteData,
  UseQueryOptions,
  UseQueryResult,
  useQueries,
} from '@tanstack/react-query';
import Icon from '@/components/primitives/Icon';
import Screen from '@/components/primitives/Screen';
import TextInput from '@/components/primitives/TextInput';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { useExploreStore } from '@/stores/explore';
import MangaBrowseList from '@/screens/Home/tabs/Browse/components/MangaBrowseList';
import Divider from '@/components/primitives/Divider';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import useUserInput from '@/hooks/useUserInput';
import {
  InfiniteMangaData,
  InfiniteMangaError,
} from '@/screens/SourceBrowser/SourceBrowser';
import { HomeStackProps } from '@/screens/Home/Home';
import { RootStack } from '@/screens/navigator';

const styles = createStyles((theme) => ({
  divider: {
    marginVertical: theme.style.size.m,
  },
}));

export type BrowseQueryResult = UseQueryResult<
  InfiniteData<InfiniteMangaData, unknown>,
  InfiniteMangaError
>;

const renderItem: ListRenderItem<BrowseQueryResult> = ({ item }) => (
  <MangaBrowseList browseQueryResult={item} />
);

const keyExtractor = (item: BrowseQueryResult, index: number) =>
  index.toString();

function ItemSeparatorComponent() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return <Divider style={style.divider} />;
}

const MangaQueryContext = React.createContext<string>('');
export function useMangaQuery() {
  return React.useContext(MangaQueryContext);
}

export default function Browse(props: HomeStackProps<'Browse'>) {
  const { navigation, route } = props;
  const { input, setInput, isDirty } = useUserInput();
  const shouldFocusInput = React.useRef<boolean>(true);
  const pinnedSources = useExploreStore((state) => state.pinnedSources);
  const results = useQueries<
    UseQueryOptions<InfiniteData<InfiniteMangaData>, InfiniteMangaError>[]
  >({
    queries: pinnedSources.map((source) => ({
      queryKey: ['browse', source.NAME, input],
      queryFn: ({ signal }) =>
        source
          .search(input, 1, signal)
          .then(
            (mangas): InfiniteData<InfiniteMangaData> => ({
              pageParams: [1],
              pages: [{ source, mangas }],
            }),
          )
          .catch((error) => Promise.reject({ error, source })),
      placeholderData: {
        pageParams: [],
        pages: [{ source, mangas: [] }],
      },
      enabled: isDirty,
    })),
  });
  const inputRef = React.useRef<NativeTextInput>(null);
  const collapsible = useCollapsibleHeader({
    showHeaderLeft: false,
    showHeaderRight: false,
    disableCollapsing: true,
    headerCenter: (
      <TextInput
        ref={inputRef}
        placeholder="Search for a manga..."
        onSubmitEditing={(e) => setInput(e.nativeEvent.text)}
        icon={<Icon type="icon" name="magnify" />}
      />
    ),
  });

  useFocusEffect(
    React.useCallback(() => {
      if (shouldFocusInput.current) {
        inputRef.current?.focus();
      }
    }, []),
  );

  React.useEffect(() => {
    const blurListener = navigation.addListener('blur', () => {
      const stack = navigation.getParent()?.getState().routes;
      if (stack != null) {
        shouldFocusInput.current = stack[stack.length - 1].name === 'Home';
      }
    });
    return () => {
      blurListener();
    };
  }, []);
  // React.useEffect(() => {
  //   console.log(results);
  // }, [results]);
  return (
    <MangaQueryContext.Provider value={input}>
      <Screen.FlatList
        data={results}
        ItemSeparatorComponent={isDirty ? ItemSeparatorComponent : null}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        collapsible={collapsible}
      />
    </MangaQueryContext.Provider>
  );
}
