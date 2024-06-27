import Manga from '@/components/composites/Manga';
import useExtendedMangaListCollapsible from '@/screens/ExtendedMangaList/hooks/useExtendedMangaListCollapsible';
import { RootStackProps } from '@/screens/navigator';
import { CodeSplitter } from '@/utils/codeSplit';
import React from 'react';

const ExtendedMangaList = React.lazy(() => import('./ExtendedMangaList'));

export default function LazyLoadedExtendedMangaList(
  props: RootStackProps<'ExtendedMangaList'>,
) {
  const {
    route: {
      params: { type },
    },
  } = props;
  const otherProps = useExtendedMangaListCollapsible({ type });
  return (
    <CodeSplitter>
      <ExtendedMangaList {...otherProps} {...props} />
    </CodeSplitter>
  );
}

export const {
  useColumns,
  getItemLayout,
  ListEmptyComponent: ActualListEmptyComponent,
  renderItem,
  keyExtractor,
  contentContainerStyle,
} = Manga.generateFlatListProps({ flexibleColumns: true });
