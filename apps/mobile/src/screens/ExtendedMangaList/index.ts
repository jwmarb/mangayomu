import Manga from '@/components/composites/Manga';

export { default } from './ExtendedMangaList';
export const {
  useColumns,
  getItemLayout,
  ListEmptyComponent: ActualListEmptyComponent,
  renderItem,
  keyExtractor,
  contentContainerStyle,
} = Manga.generateFlatListProps({ flexibleColumns: true });
