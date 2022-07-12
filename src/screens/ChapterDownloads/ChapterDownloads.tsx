import { Flex, Header, RecyclerListViewScreen, Spacer, Typography } from '@components/core';
import { ChapterDownloadsEmptyContainer } from '@screens/ChapterDownloads/ChapterDownloads.base';
import { layoutProvider, rowRenderer } from '@screens/ChapterDownloads/ChapterDownloads.recycler';
import connector, { ConnectedChapterDownloadsProps } from '@screens/ChapterDownloads/ChapterDownloads.redux';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { DataProvider, LayoutProvider } from 'recyclerlistview';

const ChapterDownloads: React.FC<ConnectedChapterDownloadsProps> = (props) => {
  const { state, manga, chapters } = props;
  const [dataProvider, setDataProvider] = React.useState(
    new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(chapters)
  );

  const options: UseCollapsibleOptions = {
    navigationOptions: {
      header: Header,
      headerTitle: `Downloads for ${manga.title}`,
    },
    config: {
      useNativeDriver: true,
    },
  };

  const collapsible = useCollapsibleHeader(options);

  if (dataProvider.getSize() === 0)
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
    <RecyclerListViewScreen
      collapsible={collapsible}
      dataProvider={dataProvider}
      layoutProvider={layoutProvider}
      rowRenderer={rowRenderer}
    />
  );
};

export default connector(ChapterDownloads);
