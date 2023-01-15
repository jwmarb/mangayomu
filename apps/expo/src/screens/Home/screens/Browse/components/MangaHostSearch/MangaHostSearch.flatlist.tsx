import { MangaComponent } from '@components/core';
import { Manga } from '@services/scraper/scraper.interfaces';
import { ListRenderItem } from 'react-native';

export const keyExtractor = (manga: Manga) => manga.link;
export const renderItem: ListRenderItem<Manga> = ({ item }) => <MangaComponent {...item} />;
