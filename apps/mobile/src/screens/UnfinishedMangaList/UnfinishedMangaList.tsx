import Box from '@components/Box/Box';
import Text from '@components/Text/Text';
import { AnimatedFlashList } from '@components/animated';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import useUnfinishedMangas from '@hooks/useUnfinishedMangas';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import React from 'react';
import {
  keyExtractor,
  renderItem,
  overrideItemLayout,
} from './UnfinishedMangaList.flatlist';
import { MANGA_LIST_ITEM_HEIGHT } from '@theme/constants';
import { useWindowDimensions } from 'react-native';
import Divider from '@components/Divider/Divider';
import Stack from '@components/Stack/Stack';

const UnfinishedMangaList: React.FC<
  RootStackProps<'UnfinishedMangaList'>
> = () => {
  const [unfinishedMangas, p] = useUnfinishedMangas();
  const { width, height } = useWindowDimensions();
  const estimatedListSize = React.useMemo(
    () => ({
      width,
      height: Math.min(
        height,
        unfinishedMangas.length * MANGA_LIST_ITEM_HEIGHT,
      ),
    }),
    [width, height, unfinishedMangas.length],
  );
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({
      headerTitle: '',
    });
  return (
    <AnimatedFlashList
      extraData={p}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={MANGA_LIST_ITEM_HEIGHT}
      estimatedListSize={estimatedListSize}
      overrideItemLayout={overrideItemLayout}
      data={unfinishedMangas}
      contentContainerStyle={contentContainerStyle}
      ListHeaderComponentStyle={scrollViewStyle}
      onScroll={onScroll}
      ListHeaderComponent={
        <Box px="m" pb="m">
          <Text variant="header" align="center">
            Finish where you've left off
          </Text>
          <Text color="textSecondary" align="center">
            You have {unfinishedMangas.length} manga
            {unfinishedMangas.length !== 1 ? 's' : ''} to catch up to.
          </Text>
        </Box>
      }
    />
  );
};

export default UnfinishedMangaList;
