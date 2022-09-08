import { MangaComponent } from '@components/core';
import { Manga } from '@services/scraper/scraper.interfaces';
import { ListRenderItem } from 'react-native';

export const keyExtractor = (item: Manga, index: number) => item.title + index;
export const renderItem: ListRenderItem<Manga> = ({ item }) => {
  return <MangaComponent {...item} />;
};
