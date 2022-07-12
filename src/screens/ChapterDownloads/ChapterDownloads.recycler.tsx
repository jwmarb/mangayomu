import { ChapterState } from '@redux/reducers/chaptersListReducer/chaptersListReducer.interfaces';
import DownloadingChapter from '@screens/ChapterDownloads/components/DownloadingChapter';
import { DownloadingChapterProps } from '@screens/ChapterDownloads/components/DownloadingChapter/DownloadingChapter.interfaces';
import { RowRenderer } from '@utils/RecyclerListView.interfaces';
import { Dimensions } from 'react-native';
import { LayoutProvider } from 'recyclerlistview';
const { width } = Dimensions.get('window');

export const layoutProvider = new LayoutProvider(
  (i) => i,
  (type, dim) => {
    dim.width = width;
    dim.height = 100;
  }
);

export const rowRenderer: RowRenderer = (type, data: DownloadingChapterProps) => {
  return <DownloadingChapter {...data} />;
};
