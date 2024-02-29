import Box from '@components/Box';
import { FilterState } from '@redux/slices/mainSourceSelector';
import React from 'react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Button from '@components/Button';
import { MangaHost } from '@mangayomu/mangascraper/src';
import integrateSortedList from '@helpers/integrateSortedList';
import { AscendingStringComparator } from '@mangayomu/algorithms';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import {
  ACCORDION_ITEM_HEIGHT,
  ACCORDION_SECTION_HEADER_HEIGHT,
} from '@theme/constants';
import createAccordionHeader from '@helpers/createAccordionHeader';
import createAccordionItem from '@helpers/createAccordionItem';
import { FilterProps } from '@screens/Library/components/LibraryFilterMenu/Tabs/Filter';
import useAppSelector from '@hooks/useAppSelector';
import { useAppDispatch } from '@redux/main';
import {
  resetFilters,
  toggleGenre,
  toggleSourceVisibility,
} from '@redux/slices/library';
interface LibraryAcccordionContextState {
  toggle: (key: string) => void;
  toggleGenre: (i: string) => void;
  toggleSourceVisibility: (i: string) => void;
}
const LibraryAccordionContext = React.createContext<
  LibraryAcccordionContextState | undefined
>(undefined);
const LibraryAccordionHeader = createAccordionHeader(
  LibraryAccordionContext,
  'toggle',
);
const LibraryAccordionGenreItem = createAccordionItem(
  'FilterItem',
  LibraryAccordionContext,
  ['toggleGenre'],
);
const LibraryAccordionSourceItem = createAccordionItem(
  'CheckboxItem',
  LibraryAccordionContext,
  ['toggleSourceVisibility'],
);
type LibraryAccordionData =
  | { type: 'ACCORDION_HEADER'; title: string }
  | { type: 'ACCORDION_GENRE_ITEM'; item: string }
  | { type: 'ACCORDION_SOURCE_ITEM'; item: string };

const Filter: React.FC<FilterProps> = (props) => {
  const filteredMangas = props.filtered;
  const filterStates = useAppSelector((state) => state.library.filters);
  const dispatch = useAppDispatch();
  const [state, setState] = React.useState({
    Sources: true,
    Genres: false,
  });
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
    dispatch(resetFilters([...hostsInLibrary]));
  }, [hostsInLibrary]);
  const genresSet = React.useMemo(() => {
    const genres = new Set<string>();
    for (const source of hostsInLibrary) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const host = MangaHost.sourcesMap.get(source)!;
      for (const genre of host.getFormattedGenres()) {
        genres.add(genre);
      }
    }
    return genres;
  }, [hostsInLibrary.size]);
  const sortedHosts = React.useMemo(() => {
    const HostComparator = (a: string, b: string) =>
      mangasPerSource[b] - mangasPerSource[a];

    const arr: string[] = [];
    for (const host of hostsInLibrary) {
      integrateSortedList(arr, HostComparator).add(host);
    }
    return arr;
  }, []);
  const sortedGenres = React.useMemo(() => {
    const arr: string[] = [];
    for (const genre of genresSet) {
      integrateSortedList(arr, AscendingStringComparator).add(genre);
    }
    return arr;
  }, [genresSet]);
  const data = React.useMemo(() => {
    const parsed: LibraryAccordionData[] = [];

    parsed.push({ type: 'ACCORDION_HEADER', title: 'Sources' });
    /**
     * Merge sortedHosts into parsed
     */
    if (state.Sources)
      for (const host of sortedHosts) {
        parsed.push({ type: 'ACCORDION_SOURCE_ITEM', item: host });
      }

    parsed.push({ type: 'ACCORDION_HEADER', title: 'Genres' });

    /**
     * Merge sortedGenres into parsed
     */
    if (state.Genres)
      for (const genre of sortedGenres) {
        parsed.push({ type: 'ACCORDION_GENRE_ITEM', item: genre });
      }

    return parsed;
  }, [sortedGenres, sortedHosts, state.Sources, state.Genres]);

  const toggle = React.useCallback(
    (key: string) => {
      setState((s) => ({ ...s, [key]: !s[key as keyof typeof state] }));
    },
    [setState],
  );

  return (
    <BottomSheetScrollView>
      <Box mb="xl">
        <LibraryAccordionContext.Provider
          value={{
            toggle,
            toggleGenre: (x) => dispatch(toggleGenre(x)),
            toggleSourceVisibility: (x) => dispatch(toggleSourceVisibility(x)),
          }}
        >
          <FlashList
            ListHeaderComponent={
              <Box mx="m" my="s">
                <Button label="Reset Filters" onPress={onResetFilter} />
              </Box>
            }
            extraData={{ state, filterStates, mangasPerSource }}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemType={getItemType}
            estimatedItemSize={ACCORDION_SECTION_HEADER_HEIGHT}
            overrideItemLayout={overrideItemLayout}
          />
        </LibraryAccordionContext.Provider>
      </Box>
    </BottomSheetScrollView>
  );
};

const overrideItemLayout: (
  layout: {
    span?: number | undefined;
    size?: number | undefined;
  },
  item: LibraryAccordionData,
  index: number,
  maxColumns: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraData?: any,
) => void = (layout, item) => {
  switch (item.type) {
    case 'ACCORDION_GENRE_ITEM':
    case 'ACCORDION_SOURCE_ITEM':
      layout.size = ACCORDION_ITEM_HEIGHT;
      break;
    case 'ACCORDION_HEADER':
      layout.size = ACCORDION_SECTION_HEADER_HEIGHT;
      break;
  }
};

const renderItem: ListRenderItem<LibraryAccordionData> = ({
  item,
  extraData,
}) => {
  switch (item.type) {
    case 'ACCORDION_HEADER':
      return (
        <LibraryAccordionHeader
          title={item.title}
          expanded={extraData.state[item.title]}
        />
      );
    case 'ACCORDION_GENRE_ITEM':
      return (
        <LibraryAccordionGenreItem
          key={item.item}
          title={item.item}
          itemKey={item.item}
          state={extraData.filterStates.Genres[item.item] ?? FilterState.ANY}
        />
      );
    case 'ACCORDION_SOURCE_ITEM':
      return (
        <LibraryAccordionSourceItem
          key={item.item}
          title={item.item}
          subtitle={`(${extraData.mangasPerSource[item.item]})`}
          checked={extraData.filterStates.Sources[item.item]}
          itemKey={item.item}
        />
      );
  }
};
const keyExtractor = (_: LibraryAccordionData, i: number) => String(i);
const getItemType = (item: LibraryAccordionData) => item.type;

export default Filter;
