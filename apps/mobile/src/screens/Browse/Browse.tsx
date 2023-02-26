import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Input from '@components/Input';
import Progress from '@components/Progress';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import { MangaHost } from '@mangayomu/mangascraper';
import React from 'react';
import {
  ListRenderItem,
  NativeSyntheticEvent,
  SectionList,
  SectionListData,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { FlatList, ScrollView, TextInput } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  SequencedTransition,
} from 'react-native-reanimated';
import connector, { ConnectedBrowseProps } from './Browse.redux';
import Item from './components/Item';
import SectionHeader from './components/SectionHeader';

import { useTheme } from '@emotion/react';
import Button from '@components/Button';
import MangaSearchResult from '@screens/Browse/components/MangaSearchResult';

const reducer = (s: boolean) => !s;

const Browse: React.FC<ConnectedBrowseProps> = (props) => {
  const {
    sources,
    pinnedSources,
    hostsWithUniversalSearch,
    initializeUniversalSearch,
    appendUniversalSearchResults,
    inputSubmitted,
    errorUniversalSearchResults,
    exitUniversalSearch,
    loading,
    universalSearchResultHandler,
    searchStates,
    setQuery,
    initialQuery,
    query,
  } = props;
  const [showSearchBar, setShowSearchBar] = React.useState(
    initialQuery != null,
  );
  function toggle() {
    setShowSearchBar((s) => !s);
  }
  React.useEffect(() => {
    if (!showSearchBar) exitUniversalSearch();
  }, [showSearchBar]);
  React.useEffect(() => {
    if (initialQuery) {
      setShowSearchBar(true);
      setQuery(initialQuery);
      setTimeout(async () => await searchMangas(initialQuery), 500);
    }
  }, [initialQuery]);
  async function searchMangas(query: string) {
    initializeUniversalSearch(hostsWithUniversalSearch);
    const results = await Promise.allSettled(
      hostsWithUniversalSearch.map(async (x) => {
        try {
          return {
            source: x,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            manga: await MangaHost.getAvailableSources().get(x)!.search(query),
          };
        } catch (e) {
          throw { source: x, error: e };
        }
      }),
    );
    universalSearchResultHandler(results);
  }
  async function handleOnSubmitEditing(
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) {
    await searchMangas(e.nativeEvent.text);
  }
  const { onScroll, scrollViewStyle, contentContainerStyle } =
    useCollapsibleTabHeader({
      headerTitle: 'Browse',
      loading,
      showHeaderRight: !showSearchBar,
      headerCenter: showSearchBar ? (
        <Box mx="m">
          <Stack space="s" flex-direction="row">
            <Input
              value={query}
              onChangeText={setQuery}
              expanded
              onSubmitEditing={handleOnSubmitEditing}
              placeholder="Universal search..."
              iconButton={
                <IconButton
                  icon={<Icon type="font" name="arrow-left" />}
                  onPress={toggle}
                />
              }
            />
          </Stack>
        </Box>
      ) : undefined,
      headerRight: (
        <IconButton
          icon={<Icon type="font" name="magnify" />}
          onPress={toggle}
        />
      ),
      headerLeftProps: {
        width: '33%',
      },
      showHeaderLeft: !showSearchBar,
      dependencies: [showSearchBar, query],
    });
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
    <SectionList
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

export default connector(Browse);
