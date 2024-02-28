import { CustomBottomSheet } from '@components/CustomBottomSheet';
import type { LibraryPreviewProps } from './';
import React from 'react';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import Text from '@components/Text';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Freeze } from 'react-freeze';
import Box from '@components/Box';
import type { Manga } from '@mangayomu/mangascraper/src';
import Animated from 'react-native-reanimated';
import { CustomizableBook } from '@components/Book';
type CustomManga = Omit<Manga, 'link'>;
const libraryExampleData: CustomManga[] = [
  {
    title: 'One Piece',
    imageCover: 'https://temp.compsci88.com/cover/One-Piece.jpg',
    source: 'MangaSee',
  },
  {
    imageCover: 'https://temp.compsci88.com/cover/Boruto.jpg',
    source: 'MangaSee',
    title: 'Boruto - Naruto Next Generations',
  },
  {
    imageCover: 'https://temp.compsci88.com/cover/Bleach.jpg',
    source: 'MangaSee',
    title: 'Bleach',
  },
  {
    imageCover: 'https://temp.compsci88.com/cover/Shingeki-No-Kyojin.jpg',
    source: 'MangaSee',
    title: 'Shingeki no Kyojin',
  },
  {
    imageCover: 'https://temp.compsci88.com/cover/Naruto.jpg',
    source: 'MangaSee',
    title: 'Naruto',
  },
  {
    imageCover: 'https://temp.compsci88.com/cover/Solo-Leveling.jpg',
    source: 'MangaSee',
    title: 'Solo Leveling',
  },
  {
    imageCover: 'https://temp.compsci88.com/cover/Jujutsu-Kaisen.jpg',
    source: 'MangaSee',
    title: 'Jujutsu Kaisen',
  },
  {
    imageCover:
      'https://temp.compsci88.com/cover/The-Beginning-After-The-End.jpg',
    source: 'MangaSee',
    title: 'The Beginning After the End',
  },
];

const LibraryPreview: React.ForwardRefRenderFunction<
  BottomSheetMethods,
  LibraryPreviewProps
> = (props, ref) => {
  const {
    onClose,
    enableLibraryPreview,
    cellComponentStyle,
    letterSpacing,
    fontSize,
    width,
    height,
  } = props;
  return (
    <CustomBottomSheet
      onClose={onClose}
      ref={ref}
      header={
        <Text variant="header" align="center" bold>
          Library Preview
        </Text>
      }
    >
      <BottomSheetScrollView>
        <Freeze freeze={!enableLibraryPreview}>
          <Box flex-direction="row" flex-wrap="wrap">
            {libraryExampleData.map((item, i) => (
              <Animated.View style={cellComponentStyle} key={i}>
                <Box
                  m="s"
                  align-items="center"
                  justify-content="center"
                  align-self="center"
                >
                  <CustomizableBook
                    letterSpacing={letterSpacing}
                    fontSize={fontSize}
                    width={width}
                    height={height}
                    title={item.title}
                    source={item.source}
                    imageCover={item.imageCover}
                  />
                </Box>
              </Animated.View>
            ))}
          </Box>
        </Freeze>
      </BottomSheetScrollView>
    </CustomBottomSheet>
  );
};

export default React.forwardRef(LibraryPreview);
