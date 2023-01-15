import { Flex, Header, RecyclerListViewScreen, Spacer, Typography } from '@components/core';
import { ChapterDownloadsEmptyContainer } from '@screens/ChapterDownloads/ChapterDownloads.base';
import { keyExtractor } from './ChapterDownloads.flatlist';
import connector, { ConnectedChapterDownloadsProps } from '@screens/ChapterDownloads/ChapterDownloads.redux';
import DownloadingChapter from '@screens/ChapterDownloads/components/DownloadingChapter';
import React from 'react';
import { Dimensions, ListRenderItem, View, Animated } from 'react-native';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { DataProvider, LayoutProvider } from 'recyclerlistview';

const ChapterDownloads: React.FC<ConnectedChapterDownloadsProps> = (props) => {
  const { manga, chaptersToDownload } = props;

  const options: UseCollapsibleOptions = {
    navigationOptions: {
      header: Header,
      headerTitle: `Downloads for ${manga.title}`,
    },
    config: {
      useNativeDriver: true,
    },
  };

  const renderItem: ListRenderItem<string> = React.useCallback(
    ({ item }) => {
      return <DownloadingChapter mangaKey={manga.link} chapterKey={item} />;
    },
    [manga]
  );

  const collapsible = useCollapsibleHeader(options);

  if (chaptersToDownload == null || (chaptersToDownload && chaptersToDownload.length === 0))
    return (
      <ChapterDownloadsEmptyContainer paddingTop={collapsible.containerPaddingTop}>
        <Typography variant='header' align='center'>
          Download queue is empty
        </Typography>
        <Spacer y={1} />
        <Typography color='textSecondary' align='center'>
          Select and download chapters from this manga to add to the queue
        </Typography>
      </ChapterDownloadsEmptyContainer>
    );

  return (
    <Animated.FlatList
      onScroll={collapsible.onScroll}
      scrollIndicatorInsets={{ top: collapsible.scrollIndicatorInsetTop }}
      contentContainerStyle={{ paddingTop: collapsible.containerPaddingTop }}
      data={chaptersToDownload}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

export default connector(ChapterDownloads);
