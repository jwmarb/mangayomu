import { bookDimensions } from '@components/Book';
import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { useQuery, useRealm } from '@database/main';
import { MangaSchema } from '@database/schemas/Manga';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import useMangaFlashlistLayout from '@hooks/useMangaFlashlistLayout';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import LibraryFilterMenu from '@screens/Library/components/LibraryFilterMenu';

const Library: React.FC = () => {
  const ref = React.useRef<BottomSheetMethods>(null);
  const mangas = useQuery(MangaSchema);
  function handleOnPress() {
    ref.current?.snapToIndex(1);
  }
  const data = React.useMemo(
    () => [...mangas.filtered('inLibrary == true')],
    [mangas],
  );
  const { renderItem, keyExtractor, estimatedItemSize, columns, key } =
    useMangaFlashlistLayout<MangaSchema>(bookDimensions);
  const { scrollViewStyle, contentContainerStyle, onScroll } =
    useCollapsibleTabHeader({
      headerTitle: 'Library',
      headerRight: (
        <IconButton
          icon={<Icon type="font" name="filter-menu" />}
          onPress={handleOnPress}
        />
      ),
    });
  return (
    <>
      <FlashList
        onScroll={onScroll}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        key={key}
        numColumns={columns}
        ListHeaderComponent={<Box style={scrollViewStyle} />}
        ListFooterComponent={<Box style={contentContainerStyle} />}
        estimatedItemSize={estimatedItemSize}
      />
      <LibraryFilterMenu ref={ref} />
    </>
  );
};

export default Library;
