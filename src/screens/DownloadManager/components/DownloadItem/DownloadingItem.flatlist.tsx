import DownloadChapter from '@screens/DownloadManager/components/DownloadItem/components/DownloadChapter';
import { ListRenderItem } from 'react-native';

export const keyExtractor = (item: string) => item;

export const renderItem: ListRenderItem<string> = ({ item }) => {
  return <DownloadChapter chapterKey={item} />;
};
