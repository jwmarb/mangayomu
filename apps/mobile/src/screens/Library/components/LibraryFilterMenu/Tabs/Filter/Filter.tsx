import Box from '@components/Box';
import CheckboxItem from '@components/Filters/CheckboxItem';

import { FilterState } from '@redux/slices/mainSourceSelector';
import FilterItem from '@components/Filters/FilterItem';
import React from 'react';
import connector, { ConnectedLibraryFilterProps } from './Filter.redux';
import { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import { ListRenderItem, SectionListData } from 'react-native';
import Button from '@components/Button';
import { MangaHost } from '@mangayomu/mangascraper';
import integrateSortedList from '@helpers/integrateSortedList';
import { StringComparator } from '@mangayomu/algorithms';
import SectionHeader from './components/SectionHeader';
const keyExtractor = (x: string, i: number) => x + i;

const Filter: React.FC<ConnectedLibraryFilterProps> = (props) => {
  const {
    filterStates,
    toggleGenre,
    toggleSourceVisibility,
    resetFilters,
    filteredMangas,
  } = props;
  const hostsInLibrary = React.useMemo(
    () =>
      filteredMangas.reduce((prev, curr) => {
        prev.add(curr.source);
        return prev;
      }, new Set<string>()),
    [filteredMangas.length],
  );
  const mangasPerSource = React.useMemo(
    () =>
      filteredMangas.reduce((prev, curr) => {
        if (curr.source in prev === false) prev[curr.source] = 1;
        else prev[curr.source] += 1;
        return prev;
      }, {} as Record<string, number>),
    [filteredMangas.length],
  );
  const onResetFilter = React.useCallback(() => {
    resetFilters([...hostsInLibrary]);
  }, [hostsInLibrary]);
  const genresSet = React.useMemo(() => {
    const genres = new Set<string>();
    for (const source of hostsInLibrary) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const host = MangaHost.getAvailableSources().get(source)!;
      for (const genre of host.getFormattedGenres()) {
        genres.add(genre);
      }
    }
    return genres;
  }, [hostsInLibrary.size]);
  const data = React.useMemo(() => {
    const HostComparator = (a: string, b: string) =>
      mangasPerSource[b] - mangasPerSource[a];
    const sortedGenres: string[] = [];
    for (const genre of genresSet) {
      integrateSortedList(sortedGenres, StringComparator).add(genre);
    }
    const sortedHosts: string[] = [];
    for (const host of hostsInLibrary) {
      integrateSortedList(sortedHosts, HostComparator).add(host);
    }
    return [
      {
        title: 'Sources',
        data: sortedHosts,
      },
      {
        title: 'Genres',
        data: sortedGenres,
      },
    ];
  }, [hostsInLibrary.size, genresSet, mangasPerSource]);
  const [state, setState] = React.useState({
    Sources: true,
    Genres: false,
  });

  const toggle = React.useCallback(
    (key: string) => {
      setState((s) => ({ ...s, [key]: !s[key as keyof typeof state] }));
    },
    [setState],
  );

  const renderSectionHeader = React.useCallback(
    ({ section }: { section: SectionListData<string> }) => (
      <SectionHeader
        title={section.title}
        expanded={state[section.title as keyof typeof state]}
        toggle={toggle}
      />
    ),
    [toggle, state],
  );

  const renderItem: ListRenderItem<string> = React.useCallback(
    ({ item }) =>
      state[genresSet.has(item) ? 'Genres' : 'Sources'] ? (
        genresSet.has(item) ? (
          <FilterItem
            key={item}
            title={item}
            itemKey={item}
            state={filterStates.Genres[item] ?? FilterState.ANY}
            onToggle={toggleGenre}
          />
        ) : (
          <CheckboxItem
            key={item}
            title={item}
            subtitle={`(${mangasPerSource[item]})`}
            checked={filterStates.Sources[item]}
            onToggle={toggleSourceVisibility}
            itemKey={item}
          />
        )
      ) : null,
    [
      state,
      filterStates.Genres,
      filterStates.Sources,
      toggleSourceVisibility,
      toggleGenre,
      genresSet,
      mangasPerSource,
    ],
  );

  return (
    <BottomSheetSectionList
      ListHeaderComponent={
        <Box mx="m" my="s">
          <Button label="Reset Filters" onPress={onResetFilter} />
        </Box>
      }
      sections={data}
      keyExtractor={keyExtractor}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
    />
  );
};

export default connector(Filter);
