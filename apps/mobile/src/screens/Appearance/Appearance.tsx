import { CustomizableBook } from '@components/Book';
import Box from '@components/Box';
import Divider from '@components/Divider';
import Stack from '@components/Stack';
import Text from '@components/Text';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import {
  BookStyle,
  toggleAutoBookHeight,
  setBookStyle as _setBookStyle,
  toggleAutoLetterSpacing,
  setBookLetterSpacing,
  setBookDimensions,
  setTitleFontSize,
} from '@redux/slices/settings';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { CustomBottomSheet } from '@components/CustomBottomSheet';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useWindowDimensions } from 'react-native';
import { Manga } from '@mangayomu/mangascraper/src';
import { useTheme } from '@emotion/react';
import Style from '@screens/Appearance/components/Style';
import CoverImage from '@screens/Appearance/components/CoverImage';
import Alignment from '@screens/Appearance/components/Alignment';
import BoldFont from '@screens/Appearance/components/BoldFont';
import FontSize from '@screens/Appearance/components/FontSize';
import LetterSpacing from '@screens/Appearance/components/LetterSpacing';
import { BOOK_DIMENSIONS_RATIO } from '@theme/constants';
import InterfaceTheme from '@screens/Appearance/components/InterfaceTheme/InterfaceTheme';
import useBoolean from '@hooks/useBoolean';
import LiveMangaPreview from '@screens/Appearance/components/LiveMangaPreview/LiveMangaPreview';
import { Freeze } from 'react-freeze';
import useAppSelector from '@hooks/useAppSelector';
import { useAppDispatch } from '@redux/main';

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

const Appearance: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    title,
    autoHeight,
    width: bookWidth,
    height: bookHeight,
    style,
  } = useAppSelector((state) => state.settings.book);
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({ headerTitle: 'Appearance' });
  const bottomSheet = React.useRef<BottomSheetMethods>(null);
  const { width: screenWidth } = useWindowDimensions();
  const [bookTitle, setBookTitle] = React.useState<string>('One Piece');
  const [imageURL, setImageURL] = React.useState<string>(
    'https://temp.compsci88.com/cover/One-Piece.jpg',
  );
  const [source, setSource] = React.useState<string>('MangaSee');
  const [enableLibraryPreview, toggleLibraryPreview] = useBoolean();
  const theme = useTheme();
  const width = useSharedValue(bookWidth);
  const height = useSharedValue(bookHeight);
  const fontSize = useSharedValue(title.size);
  const letterSpacing = useSharedValue(title.letterSpacing);
  const autoAdjustHeight = React.useCallback(
    (widthValue: number) => {
      switch (style) {
        case BookStyle.TACHIYOMI:
          height.value = widthValue / moderateScale(0.66);
          break;
        case BookStyle.CLASSIC:
        case BookStyle.MANGAROCK:
          height.value = widthValue / BOOK_DIMENSIONS_RATIO;
          break;
      }
    },
    [style],
  );
  const handleOnToggleAutoHeight = React.useCallback(() => {
    dispatch(toggleAutoBookHeight());
    autoAdjustHeight(width.value);
  }, [dispatch, autoAdjustHeight]);

  const setBookStyle = React.useCallback(
    (newValue: BookStyle) => {
      if (autoHeight)
        switch (newValue) {
          case BookStyle.TACHIYOMI:
            height.value = width.value / moderateScale(0.66);
            break;
          case BookStyle.CLASSIC:
          case BookStyle.MANGAROCK:
            height.value = width.value / BOOK_DIMENSIONS_RATIO;
            break;
        }
      dispatch(_setBookStyle(newValue));
    },
    [dispatch, autoHeight],
  );

  const handleOnChangeWidth = React.useCallback(
    (v: number) => {
      width.value = v;
      if (autoHeight) autoAdjustHeight(v);
    },
    [autoHeight, autoAdjustHeight],
  );

  const handleOnChangeHeight = React.useCallback((v: number) => {
    height.value = v;
  }, []);

  const handleOnChangeFontSize = React.useCallback((v: number) => {
    fontSize.value = v;
  }, []);

  const handleOnToggleLetterSpacing = React.useCallback(() => {
    dispatch(toggleAutoLetterSpacing());
    letterSpacing.value = -fontSize.value / moderateScale(30);
  }, [toggleAutoLetterSpacing]);

  const handleOnChangeLetterSpacing = React.useCallback((v: number) => {
    letterSpacing.value = v;
  }, []);

  function onLibraryPreview() {
    toggleLibraryPreview(true);
    bottomSheet.current?.expand();
  }

  const cellComponentStyle = useAnimatedStyle(() => ({
    width:
      screenWidth /
      Math.round(screenWidth / (width.value + 2 * theme.style.spacing.s)),
    minHeight: height.value,
  }));

  React.useEffect(() => {
    return () => {
      dispatch(setBookLetterSpacing(letterSpacing.value));
      dispatch(setBookDimensions({ width: width.value, height: height.value }));
      dispatch(setTitleFontSize(fontSize.value));
    };
  }, []);

  return (
    <>
      <Animated.ScrollView
        onScroll={onScroll}
        contentContainerStyle={contentContainerStyle}
        style={scrollViewStyle}
      >
        <Stack space="s">
          <Box>
            <InterfaceTheme />
            <Divider />
            <LiveMangaPreview
              onLibraryPreview={onLibraryPreview}
              setSource={setSource}
              setBookTitle={setBookTitle}
              setImageURL={setImageURL}
              bookTitle={bookTitle}
              imageURL={imageURL}
            >
              <CustomizableBook
                letterSpacing={letterSpacing}
                fontSize={fontSize}
                width={width}
                height={height}
                title={bookTitle}
                source={source}
                imageCover={imageURL}
              />
            </LiveMangaPreview>
            {/* <Box
              pointerEvents="none"
              p="m"
              align-self="center"
              align-items="center"
              justify-content="center"
              height={moderateScale(400)}
              overflow="hidden"
            >
              <CustomizableBook
                bookStyle={style}
                align={title.alignment}
                bold={title.bold}
                letterSpacing={letterSpacing}
                fontSize={fontSize}
                width={width}
                height={height}
                title="One Piece"
                source="MangaSee"
                imageCover="https://temp.compsci88.com/cover/One-Piece.jpg"
              />
            </Box> */}
            <Stack space="m">
              <Style setBookStyle={setBookStyle} />
              <Stack mx="m" space="m">
                <CoverImage
                  onChangeHeight={handleOnChangeHeight}
                  onChangeWidth={handleOnChangeWidth}
                  autoHeight={autoHeight}
                  onToggleAutoHeight={handleOnToggleAutoHeight}
                  width={width}
                  height={height}
                />
                <Box>
                  <Text bold variant="header">
                    Title
                  </Text>
                  <Text color="textSecondary">
                    Modify how titles should be displayed in mangas
                  </Text>
                </Box>
                <Stack
                  border-radius="@theme"
                  border-width="@theme"
                  border-color="@theme"
                  background-color="paper"
                  py="m"
                >
                  <Alignment />
                  <Divider />
                  <BoldFont />
                  <Divider />
                  <FontSize
                    fontSize={fontSize}
                    onChangeFontSize={handleOnChangeFontSize}
                  />
                  <Divider />
                  <LetterSpacing
                    letterSpacing={letterSpacing}
                    onChangeLetterSpacing={handleOnChangeLetterSpacing}
                    onToggleAutoLetterSpacing={handleOnToggleLetterSpacing}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Animated.ScrollView>
      <CustomBottomSheet
        onClose={() => toggleLibraryPreview(false)}
        ref={bottomSheet}
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
    </>
  );
};

export default Appearance;
