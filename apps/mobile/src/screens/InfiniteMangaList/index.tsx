import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Input from '@components/Input';
import useAppSelector from '@hooks/useAppSelector';
import useBoolean from '@hooks/useBoolean';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import { MangaHost } from '@mangayomu/mangascraper/src';
import { MangaHostWithFilters } from '@mangayomu/mangascraper/src/scraper/scraper.filters';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import React from 'react';
// import { register } from 'react-native-bundle-splitter';
// export default register({ loader: () => import('./InfiniteMangaList') });
const LazyInfiniteMangaList = React.lazy(() => import('./InfiniteMangaList'));
export type InfiniteMangaListMethods = {
  open: () => void;
};

export default function InfiniteMangaList(
  props: RootStackProps<'InfiniteMangaList'>,
) {
  const [showSearchBar, toggle] = useBoolean();
  const initialQuery = useAppSelector((state) => state.browse.query);
  const [query, setQuery] = React.useState<string>(initialQuery);
  const source = React.useRef(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    MangaHost.sourcesMap.get(props.route.params.source)!,
  ).current;
  const hasFilters = source instanceof MangaHostWithFilters;
  const ref = React.useRef<InfiniteMangaListMethods>(null);
  const collapsible = useCollapsibleHeader({
    headerTitle: source.name,
    showBackButton: !showSearchBar,
    header: showSearchBar ? (
      <Box {...(!hasFilters ? { mx: 'm' } : { ml: 'm' })} flex-grow>
        <Input
          expanded
          defaultValue={initialQuery}
          placeholder="Search for a title..."
          onSubmitEditing={(e) => setQuery(e.nativeEvent.text)}
          iconButton={
            <IconButton
              icon={<Icon type="font" name="arrow-left" />}
              onPress={() => toggle()}
            />
          }
        />
      </Box>
    ) : undefined,
    headerRightProps: showSearchBar ? { 'flex-shrink': true } : undefined,
    showHeaderRight: showSearchBar ? hasFilters : true,
    headerRight: (
      <>
        {!showSearchBar && (
          <IconButton
            icon={<Icon type="font" name="magnify" />}
            onPress={() => toggle()}
          />
        )}
        {hasFilters && (
          <IconButton
            icon={<Icon type="font" name="filter" />}
            onPress={() => {
              ref.current?.open();
            }}
          />
        )}
        {!showSearchBar && (
          <IconButton icon={<Icon type="font" name="web" />} />
        )}
      </>
    ),
    dependencies: [showSearchBar],
  });

  return (
    <React.Suspense>
      <LazyInfiniteMangaList
        ref={ref}
        {...props}
        {...collapsible}
        query={query}
      />
    </React.Suspense>
  );
}
