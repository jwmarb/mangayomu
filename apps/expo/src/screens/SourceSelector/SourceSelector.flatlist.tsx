import MangaSource from '@screens/SourceSelector/components/MangaSource';
import { MangaSourceProps } from '@screens/SourceSelector/components/MangaSource/MangaSource.interfaces';
import MangaHost from '@services/scraper/scraper.abstract';
import { ListRenderItem } from 'react-native';

export const keyExtractor = (value: MangaSourceProps) => value.source.getName();
export const renderItem: ListRenderItem<MangaSourceProps> = ({ item }) => <MangaSource {...item} />;
