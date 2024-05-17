import { AscendingStringComparator } from '@mangayomu/algorithms';
import { MangaSource } from '@mangayomu/mangascraper';
import React from 'react';
import { ListRenderItem } from 'react-native';
import Modal from '@/components/composites/Modal';
import useUserInput from '@/hooks/useUserInput';
import LibraryGenreFilterItem, {
  LibraryGenreFilterProps,
} from '@/screens/Home/tabs/Library/components/filter/LibraryGenreFilterItem';
import { getItemLayout } from '@/screens/SourceBrowser/components/InclusiveExclusive';
import { mmkv } from '@/utils/persist';

const LIBRARY_GENRES_KEY = 'library/genres';

export type LibraryFilterGenreMenuProps = {
  sources: string[];
  onChips: (chips: React.ReactNode[]) => void;
  onFilter: (include: string[], exclude: string[]) => void;
};

const keyExtractor = (k: string) => k;

function LibraryFilterGenreMenu(
  props: LibraryFilterGenreMenuProps,
  ref: React.ForwardedRef<Modal>,
) {
  const { sources, onChips, onFilter } = props;
  const { input, setInput } = useUserInput();
  const cache = React.useRef<Map<string, string[]>>(new Map());
  const deferredInput = React.useDeferredValue(input);
  const [numOfItems, setNumOfItems] = React.useState<number>(10);
  const initializer = () => {
    const state: Record<string, LibraryGenreFilterProps['type']> = JSON.parse(
      mmkv.getString(LIBRARY_GENRES_KEY) ?? '{}',
    );
    for (const source of sources) {
      const mangaSource = MangaSource.getSource(source);
      const sourceGenres = mangaSource.GENRES;
      for (const genre of sourceGenres) {
        const readableGenre = mangaSource.READABLE_GENRES_MAP[genre];
        if (readableGenre in state === false) {
          state[readableGenre] = 'default';
        }
      }
    }
    return {
      allGenres: Object.keys(state).sort(AscendingStringComparator),
      state,
    };
  };
  const [{ allGenres, state }, setLibraryState] = React.useState(initializer);
  React.useEffect(() => {
    setLibraryState(initializer);
  }, [sources]);

  const data = React.useMemo(() => {
    let cached = cache.current.get(deferredInput);
    if (cached == null) {
      cached =
        deferredInput.length > 0
          ? allGenres
              .filter((x) => x.toLowerCase().trim().includes(deferredInput))
              .slice(0, numOfItems)
          : allGenres.slice(0, numOfItems);
      cache.current.set(deferredInput, cached);
    }
    return cached;
  }, [deferredInput, allGenres, numOfItems]);

  const handleOnSelect = React.useCallback((genre: string) => {
    setLibraryState((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        [genre]:
          prev.state[genre] === 'default'
            ? 'include'
            : prev.state[genre] === 'include'
            ? 'exclude'
            : 'default',
      },
    }));
  }, []);

  React.useEffect(() => {
    mmkv.set(LIBRARY_GENRES_KEY, JSON.stringify(state));
    const result: React.ReactNode[] = [];
    const include: string[] = [];
    const exclude: string[] = [];
    for (const genre in state) {
      switch (state[genre]) {
        case 'include':
          include.push(genre);
          result.push(
            <LibraryGenreFilterItem
              key={genre}
              title={genre}
              type="include"
              onSelect={handleOnSelect}
            />,
          );
          break;
        case 'exclude':
          exclude.push(genre);
          result.push(
            <LibraryGenreFilterItem
              key={genre}
              title={genre}
              type="exclude"
              onSelect={handleOnSelect}
            />,
          );
          break;
      }
    }
    onChips(result);
    onFilter(include, exclude);
  }, [state]);

  const renderItem: ListRenderItem<string> = React.useCallback(
    ({ item }) => {
      switch (state[item]) {
        case 'include':
          return (
            <LibraryGenreFilterItem
              title={item}
              type="include"
              onSelect={handleOnSelect}
            />
          );
        case 'exclude':
          return (
            <LibraryGenreFilterItem
              title={item}
              type="exclude"
              onSelect={handleOnSelect}
            />
          );
        default:
          return (
            <LibraryGenreFilterItem
              title={item}
              type="default"
              onSelect={handleOnSelect}
            />
          );
      }
    },
    [state],
  );

  const handleOnReachedEnd = React.useCallback(() => {
    setNumOfItems((prev) => prev << 1);
    cache.current?.clear();
  }, []);

  return (
    <Modal ref={ref}>
      <Modal.Header
        input
        placeholder="Search for a genre..."
        onChangeText={setInput}
      />
      <Modal.FlatList
        getItemLayout={getItemLayout}
        windowSize={9}
        maxToRenderPerBatch={9}
        updateCellsBatchingPeriod={50}
        keyboardShouldPersistTaps="handled"
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={handleOnReachedEnd}
      />
    </Modal>
  );
}

export default React.forwardRef(LibraryFilterGenreMenu);
