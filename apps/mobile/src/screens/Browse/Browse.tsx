import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Input from '@components/Input';
import Stack from '@components/Stack';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import { MangaHost } from '@mangayomu/mangascraper/src';
import React from 'react';
import {
  ListRenderItem,
  NativeSyntheticEvent,
  SectionList,
  SectionListData,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Item from './components/Item';
import SectionHeader from './components/SectionHeader';

import MangaSearchResult from '@screens/Browse/components/MangaSearchResult';
import { AnimatedSectionList } from '@components/animated';
import {
  exitUniversalSearch,
  initializeUniversalSearch,
  setQuery,
  universalSearchResultHandler,
} from '@redux/slices/browse';
import { useAppDispatch } from '@redux/main';
import useAppSelector from '@hooks/useAppSelector';
import { shallowEqual } from 'react-redux';
import { BrowseMethods } from '@screens/Browse';

const Browse: React.ForwardRefRenderFunction<
  BrowseMethods,
  ReturnType<typeof useCollapsibleTabHeader> & {
    showSearchBar: boolean;
    setShowSearchBar: (val?: boolean) => void;
    initialQuery?: string;
  }
> = (
  {
    onScroll,
    scrollViewStyle,
    contentContainerStyle,
    initialQuery,
    setShowSearchBar,
    showSearchBar,
  },
  ref,
) => {
  const dispatch = useAppDispatch();
  const hostsWithUniversalSearch = useAppSelector(
    (state) =>
      state.host.name.filter(
        (x) => state.host.hostsConfig[x].useWithUniversalSearch === true,
      ),
    shallowEqual,
  );
  const pinnedSources = useAppSelector(
    (state) => Object.keys(state.host.pinned),
    shallowEqual,
  );
  const sources = useAppSelector((state) => state.host.name);
  const inputSubmitted = useAppSelector((state) => state.browse.inputSubmitted);
  const [search, setSearch] = React.useState<string>('');

  React.useEffect(() => {
    if (initialQuery) {
      const abortController = new AbortController();
      setShowSearchBar(true);
      dispatch(setQuery(initialQuery));
      setTimeout(
        async () => await searchMangas(initialQuery, abortController),
        500,
      );
      return () => {
        abortController.abort();
      };
    }
  }, [initialQuery]);
  React.useEffect(() => {
    if (!showSearchBar) {
      setSearch('');
      dispatch(exitUniversalSearch());
    }
  }, [showSearchBar]);
  React.useEffect(() => {
    if (search) {
      const abortController = new AbortController();
      searchMangas(search, abortController);
      return () => {
        abortController.abort();
      };
    }
  }, [search]);
  async function searchMangas(query: string, abortController: AbortController) {
    dispatch(initializeUniversalSearch(hostsWithUniversalSearch));
    const results = await Promise.allSettled(
      hostsWithUniversalSearch.map(async (x) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const host = MangaHost.sourcesMap.get(x)!;
          host.signal = abortController.signal;
          return {
            source: x,
            manga: await host.search(query),
          };
        } catch (e) {
          throw { source: x, error: e };
        }
      }),
    );
    dispatch(universalSearchResultHandler(results));
  }
  async function handleOnSubmitEditing(
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) {
    setSearch(e.nativeEvent.text);
  }

  React.useImperativeHandle(ref, () => ({
    handleOnSubmitEditing,
  }));

  const data = React.useMemo(() => {
    return [
      {
        title: 'Pinned',
        data: pinnedSources,
      },
      {
        title: 'Last used',
        data: [],
      },
      {
        title: 'Sources',
        data: sources,
      },
    ];
  }, [sources.length, pinnedSources.length]);
  if (inputSubmitted && search.length > 0)
    return (
      <ScrollView
        onScroll={onScroll}
        style={scrollViewStyle}
        contentContainerStyle={contentContainerStyle}
      >
        <Stack space="s" flex-direction="column" my="s">
          {hostsWithUniversalSearch.map((x) => (
            <MangaSearchResult source={x} key={x} />
          ))}
        </Stack>
      </ScrollView>
    );
  return (
    <AnimatedSectionList
      onScroll={onScroll}
      style={scrollViewStyle}
      contentContainerStyle={contentContainerStyle}
      sections={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      renderSectionHeader={renderSectionHeader}
    />
  );
};

const keyExtractor = (i: string) => i;

const renderItem: ListRenderItem<string> = ({ item }) => <Item item={item} />;
const renderSectionHeader = (info: {
  section: SectionListData<
    string,
    {
      title: string;
      data: string[];
    }
  >;
}) =>
  info.section.data.length > 0 ? (
    <SectionHeader title={info.section.title} />
  ) : null;

export default React.forwardRef(Browse);
