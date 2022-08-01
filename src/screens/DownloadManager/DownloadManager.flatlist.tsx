import { MangaDownloadingState } from '@redux/reducers/mangaDownloadingReducer/mangaDownloadingReducer.interfaces';
import DownloadItem from '@screens/DownloadManager/components/DownloadItem';
import { ListRenderItem } from 'react-native';

export const renderItem: ListRenderItem<string> = ({ item }) => {
  return <DownloadItem mangaKey={item} />;
};
