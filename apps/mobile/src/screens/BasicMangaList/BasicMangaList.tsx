import connector, {
  ConnectedBasicMangaListProps,
} from './BasicMangaList.redux';
import React from 'react';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import Box from '@components/Box';
import { FlashList } from '@shopify/flash-list';
import useMangaFlashlistLayout from '@hooks/useMangaFlashlistLayout';
import { AnimatedFlashList } from '@components/animated';

const BasicMangaList: React.FC<ConnectedBasicMangaListProps> = (props) => {
  const { mangas, title, bookHeight, bookWidth } = props;
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({ headerTitle: title });
  const {
    estimatedItemSize,
    columns,
    renderItem,
    keyExtractor,
    key,
    overrideItemLayout,
    drawDistance,
  } = useMangaFlashlistLayout(
    {
      width: bookWidth,
      height: bookHeight,
    },
    mangas.length,
  );

  return (
    <AnimatedFlashList
      drawDistance={drawDistance}
      estimatedItemSize={estimatedItemSize}
      // estimatedListSize={estimatedListSize}
      overrideItemLayout={overrideItemLayout}
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
