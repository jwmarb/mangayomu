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

  React.useEffect(() => {
    if (initialQuery) {
      setShowSearchBar(true);
      dispatch(setQuery(initialQuery));
      setTimeout(async () => await searchMangas(initialQuery), 500);
    }
  }, [initialQuery]);
  async function searchMangas(query: string) {
    dispatch(initializeUniversalSearch(hostsWithUniversalSearch));
    const results = await Promise.allSettled(
      hostsWithUniversalSearch.map(async (x) => {
        try {
          return {
            source: x,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            manga: await MangaHost.sourcesMap.get(x)!.search(query),
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
    await searchMangas(e.nativeEvent.text);
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
  if (inputSubmitted)
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
