import connector, {
  ConnectedInfinteMangaListProps,
} from './InfiniteMangaList.redux';
import React from 'react';
import { FlashList } from '@shopify/flash-list';
import useMangaFlashlistLayout from '@hooks/useMangaFlashlistLayout';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import Box from '@components/Box';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import Text from '@components/Text';
import Stack from '@components/Stack';
import Animated, { FadeOut } from 'react-native-reanimated';
import Input from '@components/Input';
import {
  InteractionManager,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { MangaHostWithFilters } from '@mangayomu/mangascraper/src/scraper/scraper.filters';
import AdvancedSearchFilters from '@screens/InfiniteMangaList/components/AdvancedSearchFilters';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import {
  AbstractFilters,
  MutableAbstractFilter,
  OptionFilter,
  SortFilter,
} from '@mangayomu/schema-creator';
import { FilterState } from '@redux/slices/mainSourceSelector';
import { InclusiveExclusiveFilter } from '@mangayomu/schema-creator';
import { Manga } from '@mangayomu/mangascraper/src';
import { StatusAPI } from '@redux/slices/explore';
import { getErrorMessage } from '@helpers/getErrorMessage';
import useMountedEffect from '@hooks/useMountedEffect';
import Button from '@components/Button';
import { moderateScale } from 'react-native-size-matters';
import { LoadingBook } from '@components/Book';
import { AnimatedFlashList } from '@components/animated';

const reducer = (s: boolean) => !s;

export type StatefulFilter =
  | StatefulInclusiveExclusive
  | StatefulSort
  | StatefulOption;
export type StatefulInclusiveExclusive = {
  type: 'inclusive/exclusive';
  record: Record<string, FilterState>;
};
export type StatefulSort = {
  type: 'sort';
  selected: string;
  reversed: boolean;
};
export type StatefulOption = { type: 'option'; selected: string };

const InfiniteMangaList: React.FC<ConnectedInfinteMangaListProps> = (props) => {
  const {
    genre,
    source,
    state,
    initialQuery,
    isOffline,
    bookHeight,
    bookWidth,
  } = props;
  const numberOfItemsPerPage = React.useRef<number | null>(
    state?.mangas.length ?? null,
  );
  const [query, setQuery] = React.useState<string>(initialQuery);
  const [mangas, setMangas] = React.useState<Manga[]>(state?.mangas ?? []);

  const [status, setStatus] = React.useState<StatusAPI>(
    state == null ? 'loading' : 'done',
  );
  const [error, setError] = React.useState<string>('');
  const hasNext = React.useRef<boolean>(true);
  const ref = React.useRef<BottomSheet>(null);
  function handleOnOpen() {
    ref.current?.snapToIndex(1);
  }
  const filters = React.useMemo(() => {
    if (source instanceof MangaHostWithFilters === false) return null;
    const filters = (
      source as MangaHostWithFilters<Record<string, AbstractFilters>>
    ).filterSchema.schema;
    const accordionOnlyKeys: string[] = [];
    const restKeys: string[] = [];
    const keys: string[] = [];
    for (const key in filters) {
      keys.push(key);
      switch (filters[key].type) {
        case 'inclusive/exclusive':
          accordionOnlyKeys.push(key);
          break;
        default:
          restKeys.push(key);
          break;
      }
    }
    return {
      options: keys,
      state: filters,
      accordion: accordionOnlyKeys,
      restKeys,
    };
  }, [source]);

  const initialFilterState = React.useMemo(
    () =>
      filters
        ? filters.options.reduce((prev, curr) => {
            const state = filters.state[curr];
            switch (state.type) {
              case 'inclusive/exclusive':
                prev[curr] = {
                  type: 'inclusive/exclusive',
                  record:
                    genre != null &&
                    (state as InclusiveExclusiveFilter<string>).fields.indexOf(
                      genre,
                    ) !== -1
                      ? { [genre]: FilterState.INCLUDE }
                      : {},
                };
                return prev;
              case 'option':
                prev[curr] = { type: 'option', selected: state.default };
                return prev;
              case 'sort':
                prev[curr] = {
                  type: 'sort',
                  selected: state.default,
                  reversed: false,
                };
                return prev;
              default:
                return prev;
            }
          }, {} as Record<string, StatefulFilter>)
        : undefined,
    [filters?.options, filters?.state, genre],
  );

  const [filterOptions, setFilterOptions] = React.useState<
    Record<string, StatefulFilter> | undefined
  >(initialFilterState);

  const parsedFilter = React.useRef<MutableAbstractFilter>(
    filters != null
      ? filters.options.reduce((prev, curr) => {
          const state = filters.state[curr];
          switch (state.type) {
            case 'description':
              return prev;
            case 'inclusive/exclusive':
              prev[curr] = {
                type: 'inclusive/exclusive',
                exclude: [],
                include: [],
                fields: state.fields,
              };
              return prev;
            case 'option':
              prev[curr] = {
                type: 'option',
                options: state.options,
                default: state.default,
                value: state.default,
              };
              return prev;
            case 'sort':
              prev[curr] = {
                type: 'sort',
                options: state.options,
                default: state.default,
                value: state.default,
                reversed: false,
              };
              return prev;
            default:
              return prev;
          }
        }, {} as MutableAbstractFilter)
      : {},
  );

  const [showSearchBar, toggle] = React.useReducer(reducer, !!initialQuery);
  const {
    estimatedItemSize,
    keyExtractor,
    renderItem,
    columns,
    key,
    overrideItemLayout,
    drawDistance,
  } = useMangaFlashlistLayout(
    {
      width: bookWidth,
      height: bookHeight,
    },
    mangas.length,
  );
  async function handleOnSubmitEditing(
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) {
    setQuery(e.nativeEvent.text);
  }

  useMountedEffect(() => {
    resetSearchState();
    fetchMangas();
  }, [query]);
  const { onScroll, scrollViewStyle, contentContainerStyle } =
    useCollapsibleHeader({
      headerTitle: source.name,
      showBackButton: !showSearchBar,
      header: showSearchBar ? (
        <Box {...(filters == null ? { mx: 'm' } : { ml: 'm' })} flex-grow>
          <Input
            expanded
            defaultValue={initialQuery}
            placeholder="Search for a title..."
            onSubmitEditing={handleOnSubmitEditing}
            iconButton={
              <IconButton
                icon={<Icon type="font" name="arrow-left" />}
                onPress={toggle}
              />
            }
          />
        </Box>
      ) : undefined,
      headerRightProps: showSearchBar ? { 'flex-shrink': true } : undefined,
      showHeaderRight: showSearchBar ? filters != null : true,
      headerRight: (
        <>
          {!showSearchBar && (
            <IconButton
              icon={<Icon type="font" name="magnify" />}
              onPress={toggle}
            />
          )}
          {filters != null && (
            <IconButton
              icon={<Icon type="font" name="filter" />}
              onPress={handleOnOpen}
            />
          )}
          {!showSearchBar && (
            <IconButton icon={<Icon type="font" name="web" />} />
          )}
        </>
      ),
      dependencies: [showSearchBar],
    });

  const handleOnChangeOption = React.useCallback(
    (key: string, val: string) => {
      setFilterOptions((prev) =>
        prev
          ? {
              ...prev,
              [key]: { type: 'option', selected: val } as StatefulOption,
            }
          : undefined,
      );
    },
    [setFilterOptions],
  );

  const handleOnChangeSort = React.useCallback(
    (key: string, selected: string) => {
      setFilterOptions((prev) =>
        prev
          ? {
              ...prev,
              [key]: {
                type: 'sort',
                selected: selected,
                reversed: (prev[key] as StatefulSort).reversed,
              } as StatefulSort,
            }
          : undefined,
      );
    },
    [setFilterOptions],
  );

  const handleOnReverseSort = React.useCallback(
    (key: string) => {
      setFilterOptions((prev) =>
        prev
          ? {
              ...prev,
              [key]: {
                type: 'sort',
                selected: (prev[key] as StatefulSort).selected,
                reversed: !(prev[key] as StatefulSort).reversed,
              } as StatefulSort,
            }
          : undefined,
      );
    },
    [setFilterOptions],
  );

  const handleOnToggleInclusiveExclusive = React.useCallback(
    (key: string, item: string) => {
      setFilterOptions((prev) => {
        if (prev == null) return undefined;

        const state = prev[key] as StatefulInclusiveExclusive;
        if (item in state.record) {
          switch (state.record[item]) {
            case FilterState.INCLUDE: // switch to Exclude
              return {
                ...prev,
                [key]: {
                  type: 'inclusive/exclusive',
                  record: { ...state.record, [item]: FilterState.EXCLUDE },
                },
              };
            case FilterState.EXCLUDE: // delete
              delete state.record[item];
              return {
                ...prev,
                [key]: {
                  type: 'inclusive/exclusive',
                  record: { ...state.record },
                },
              };
          }
        }
        return {
          ...prev,
          [key]: {
            type: 'inclusive/exclusive',
            record: { ...state.record, [item]: FilterState.INCLUDE },
          },
        };
      });
    },
    [setFilterOptions],
  );

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      if (genre != null) beginParsingFilter();
      if (state == null) await fetchMangas();
      else source.addPage();
    });
    return () => {
      source.resetPage();
    };
  }, []);

  function resetSearchState() {
    setMangas([]);
    hasNext.current = true;
    source.resetPage();
  }
  function beginParsingFilter() {
    if (filters != null && filterOptions != null) {
      for (const key in filterOptions) {
        const state = filterOptions[key];
        const dummyState = filters.state[key];
        switch (state.type) {
          case 'inclusive/exclusive': {
            const p = {
              type: 'inclusive/exclusive' as const,
              include: [] as string[],
              exclude: [] as string[],
              fields: (dummyState as InclusiveExclusiveFilter<string>).fields,
            };
            for (const field in state.record) {
              switch (state.record[field]) {
                case FilterState.INCLUDE:
                  p.include.push(field);
                  break;
                case FilterState.EXCLUDE:
                  p.exclude.push(field);
                  break;
              }
            }
            parsedFilter.current[key] = p;
            break;
          }
          case 'option': {
            parsedFilter.current[key] = {
              type: 'option' as const,
              options: (dummyState as OptionFilter<string>).options,
              default: (dummyState as OptionFilter<string>).default,
              value: state.selected,
            } as const;
            break;
          }
          case 'sort': {
            parsedFilter.current[key] = {
              type: 'sort',
              options: (dummyState as SortFilter<string>).options,
              default: (dummyState as SortFilter<string>).default,
              reversed: state.reversed,
              value: state.selected,
            };
            break;
          }
        }
      }
    }
  }
  async function handleOnApplyFilters() {
    if (filters != null && filterOptions != null) {
      beginParsingFilter();
      resetSearchState();
      ref.current?.close();
      await fetchMangas(true);
    }
  }
  async function fetchMangas(isReceivingNewBatch?: boolean) {
    setStatus('loading');
    try {
      let data: Manga[];
      if (source instanceof MangaHostWithFilters)
        data = await source.search(query, parsedFilter.current);
      else data = await source.search(query);
      if (!isReceivingNewBatch) {
        // Check if the data length returned is 0. If it is, then it should be assumed that this is the end of the list.
        if (data.length === 0) {
          hasNext.current = false;
          setStatus('done');
          return;
        }
        if (
          mangas.length > 0 &&
          data[data.length - 1].link === mangas[mangas.length - 1].link
        ) {
          // Check if the last elements appear to be the same. If they are, we should assume this is the end of the list.
          hasNext.current = false;
          setStatus('done');
          return;
        }
        if (
          numberOfItemsPerPage.current &&
          data.length < numberOfItemsPerPage.current
        )
          hasNext.current = false;
      }

      setMangas((prev) => prev.concat(data));
      numberOfItemsPerPage.current =
        numberOfItemsPerPage.current ?? data.length;

      source.addPage();
      setStatus('done');
    } catch (e) {
      setStatus('failed_with_errors');
      setError(getErrorMessage(e));
    }
  }
  function handleOnResetFilters() {
    setFilterOptions(initialFilterState);
  }
  async function handleOnReachedEnd() {
    if (hasNext.current && status !== 'loading' && !isOffline)
      await fetchMangas();
  }
  return (
    <>
      <AnimatedFlashList
        drawDistance={drawDistance}
        onEndReached={handleOnReachedEnd}
        overrideItemLayout={overrideItemLayout}
        onEndReachedThreshold={0.2}
        data={mangas}
        ListHeaderComponent={<Box style={scrollViewStyle} />}
        ListFooterComponent={
          <Box my="s" style={contentContainerStyle}>
            {hasNext.current &&
              status !== 'failed_with_errors' &&
              !isOffline && (
                <Animated.View exiting={FadeOut}>
                  <Stack
                    space="s"
                    flex-direction="row"
                    flex-wrap="wrap"
                    align-items="center"
                    justify-content="space-evenly"
                  >
                    {MangaLoadingList}
                  </Stack>
                </Animated.View>
              )}
            {status === 'failed_with_errors' && error && !isOffline && (
              <Stack space="s" flex-grow my="s" mx="m">
                <Text color="error" align="center">
                  {error}
                </Text>
                <Button label="Retry Fetch" variant="contained" />
              </Stack>
            )}
            {isOffline && (
              <Box flex-grow justify-content="center" align-items="center">
                <Icon
                  size={moderateScale(120)}
                  type="font"
                  name="wifi-off"
                  color="textSecondary"
                />
                <Text variant="header" bold align="center">
                  You are Offline
                </Text>
                <Text color="textSecondary" align="center">
                  Check your internet connection.
                </Text>
              </Box>
            )}
          </Box>
        }
        onScroll={onScroll}
        estimatedItemSize={estimatedItemSize}
        numColumns={columns}
        key={key}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        persistentScrollbar
      />
      {filters && filterOptions && (
        <AdvancedSearchFilters
          onApplyFilters={handleOnApplyFilters}
          onToggleInclusiveExclusive={handleOnToggleInclusiveExclusive}
          onChangeOption={handleOnChangeOption}
          ref={ref}
          onResetFilters={handleOnResetFilters}
          keys={filters.restKeys}
          dummyStates={filters.state}
          states={filterOptions}
          onToggleReverseSort={handleOnReverseSort}
          onChangeSort={handleOnChangeSort}
          accordionKeys={filters.accordion}
        />
      )}
    </>
  );
};

const MangaLoadingList = new Array(12)
  .fill('')
  .map((x, i) => <LoadingBook key={i} />);

export default connector(InfiniteMangaList);
