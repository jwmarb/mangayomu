import { DownloadingManga } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';
import DownloadItem from '@screens/DownloadManager/components/DownloadItem';
import { ListRenderItem } from 'react-native';

export const renderItem: ListRenderItem<[string, DownloadingManga]> = ({ item }) => {
  return <DownloadItem mangaKey={item[0]} downloadingManga={item[1]} />;
};
