import { MangaComponent } from '@components/core';
import { LibraryManga } from '@redux/reducers/mangalibReducer/mangalibReducer.interfaces';
import { MangaContainer } from '@screens/Home/screens/MangaLibrary/MangaLibrary.base';
import { ListRenderItem } from 'react-native';

export const keyExtractor = (manga: LibraryManga) => manga.manga.link;

export const renderItem: ListRenderItem<LibraryManga> = ({ item }) => <MangaComponent {...item.manga} />;
