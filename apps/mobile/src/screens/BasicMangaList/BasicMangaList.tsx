import connector, {
  ConnectedBasicMangaListProps,
} from './BasicMangaList.redux';
import React from 'react';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import { bookDimensions } from '@components/Book';
import Box from '@components/Box';
import { FlashList } from '@shopify/flash-list';
import useMangaFlashlistLayout from '@hooks/useMangaFlashlistLayout';

const BasicMangaList: React.FC<ConnectedBasicMangaListProps> = (props) => {
  const { mangas, title } = props;
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({ headerTitle: title });
  const { estimatedItemSize, columns, renderItem, keyExtractor, key } =
    useMangaFlashlistLayout(bookDimensions);

  return (
    <FlashList
      estimatedItemSize={estimatedItemSize}
      data={mangas}
      key={key}
      numColumns={columns}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={<Box style={scrollViewStyle} />}
      ListFooterComponent={<Box style={contentContainerStyle} />}
      {...{
        onScroll,
        onMomentumScrollEnd: onScroll,
      }}
    />
  );
};

export default connector(BasicMangaList);
