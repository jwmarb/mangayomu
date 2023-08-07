import Badge from '@components/Badge';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Input from '@components/Input';
import { useQuery } from '@database/main';
import { MangaSchema } from '@database/schemas/Manga';
import useAppSelector from '@hooks/useAppSelector';
import useBoolean from '@hooks/useBoolean';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import { useAppDispatch } from '@redux/main';
import { exitUniversalSearch } from '@redux/slices/browse';
import React from 'react';
// import { register } from 'react-native-bundle-splitter';
// export default register({ loader: () => import('./Library') });

const LazyLibrary = React.lazy(() => import('./Library'));
const LibrarySetRefreshingContext = React.createContext<
  ((val?: boolean) => void) | null
>(null);
const LibraryRefreshingContext = React.createContext<boolean | null>(null);
export const useLibrarySetRefreshing = () => {
  const ctx = React.useContext(LibrarySetRefreshingContext);
  if (ctx == null)
    throw new Error(
      'Cannot consume LibrarySetRefreshingContext when component is not a child of it',
    );
  return ctx;
};
export const useLibraryRefreshing = () => {
  const ctx = React.useContext(LibraryRefreshingContext);
  if (ctx == null)
    throw new Error(
      'Cannot consume LibrarySetRefreshingContext when component is not a child of it',
    );
  return ctx;
};

export type LibraryMethods = {
  updateQuerifiedData: (e: string) => void;
  openFilters: () => void;
};

export default function Library() {
  const [showSearchBar, setShowSearchBar] = useBoolean();
  const [refreshing, setRefreshing] = useBoolean();
  const [query, setQuery] = React.useState<string>('');
  const mangasInLibrary = useQuery(MangaSchema, (collection) =>
    collection.filtered('inLibrary == true'),
  );
  const dispatch = useAppDispatch();
  const ref = React.useRef<LibraryMethods>(null);
  const numberOfAppliedFilters = useAppSelector(
    (state) => state.library.numberOfFiltersApplied,
  );
  React.useEffect(() => {
    if (!showSearchBar) dispatch(exitUniversalSearch());
  }, [showSearchBar]);
  const props = useCollapsibleTabHeader({
    headerTitle: 'Library',
    headerLeft:
      mangasInLibrary.length > 0 && !showSearchBar ? (
        <Badge type="dot" show={query.length > 0} color="primary">
          <IconButton
            icon={<Icon type="font" name="magnify" />}
            onPress={() => setShowSearchBar(true)}
          />
        </Badge>
      ) : (
        <Input
          defaultValue={query}
          onChangeText={(e) => {
            setQuery(e);
            ref.current?.updateQuerifiedData(e);
          }}
          placeholder="Search for a title..."
          expanded
          iconButton={
            <IconButton
              icon={<Icon type="font" name="arrow-left" />}
              onPress={() => setShowSearchBar(false)}
            />
          }
        />
      ),
    showHeaderLeft: mangasInLibrary.length > 0,
    headerLeftProps:
      mangasInLibrary.length > 0 && !showSearchBar
        ? { 'flex-shrink': true }
        : { 'flex-grow': true },
    showHeaderRight: mangasInLibrary.length > 0,
    showHeaderCenter: !showSearchBar,
    headerRight: (
      <Badge type="number" count={numberOfAppliedFilters} color="primary">
        <IconButton
          icon={<Icon type="font" name="filter-menu" />}
          onPress={() => {
            ref.current?.openFilters();
          }}
        />
      </Badge>
    ),
    loading: refreshing,
    headerRightProps: { 'flex-shrink': true },
    dependencies: [
      mangasInLibrary.length > 0,
      numberOfAppliedFilters,
      showSearchBar,
      query.length > 0,
    ],
  });

  return (
    <LibraryRefreshingContext.Provider value={refreshing}>
      <LibrarySetRefreshingContext.Provider value={setRefreshing}>
        <LazyLibrary ref={ref} {...props} />
      </LibrarySetRefreshingContext.Provider>
    </LibraryRefreshingContext.Provider>
  );
}
