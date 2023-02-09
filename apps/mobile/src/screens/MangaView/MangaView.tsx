import Book, { bookDimensions } from '@components/Book';
import Box from '@components/Box';
import Cover from '@components/Cover';
import Text from '@components/Text';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { ScaledSheet } from 'react-native-size-matters';

const data = [1, 2, 3];

const MangaView: React.FC<RootStackProps<'MangaView'>> = (props) => {
  const {
    route: {
      params: { dbKey },
    },
    navigation,
  } = props;

  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({ headerTitle: '' });

  return (
    <FlashList
      data={data}
      ListHeaderComponent={
        <Box style={scrollViewStyle}>
          <Text>Hello World</Text>
        </Box>
      }
      ListFooterComponent={<Box style={contentContainerStyle} />}
      renderItem={null}
      estimatedItemSize={5}
      {...{ onScroll }}
    />
  );
};

export default MangaView;
