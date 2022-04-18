import { ReadingChapterInfo } from '@redux/reducers/mangaReducer/mangaReducer.interfaces';
import { ListRenderItem } from 'react-native';
import { Chapter } from '@components/core';

export const keyExtractor = (chapter: ReadingChapterInfo) => chapter.link;

export const renderItem: ListRenderItem<ReadingChapterInfo> = ({ item }) => {
  return <Chapter chapter={item} />;
};
