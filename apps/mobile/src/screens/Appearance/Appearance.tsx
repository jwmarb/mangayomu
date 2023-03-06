import { bookDimensions, CustomizableBook } from '@components/Book';
import Box from '@components/Box';
import Button from '@components/Button';
import Checkbox from '@components/Checkbox';
import Divider from '@components/Divider';
import Radio from '@components/Radio';
import RadioGroup from '@components/RadioGroup';
import Slider from '@components/Slider';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import { BookStyle, TitleAlignment } from '@redux/slices/settings';
import React from 'react';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import connector, { ConnectedAppearanceProps } from './Appearance.redux';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { CustomBottomSheet } from '@components/CustomBottomSheet';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useWindowDimensions } from 'react-native';
import { Manga } from '@mangayomu/mangascraper';
import { useTheme } from '@emotion/react';

const BOOK_RATIO = bookDimensions.width / bookDimensions.height;

type CustomManga = Omit<Manga, 'index' | 'link'>;

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
const keyExtractor = (_: CustomManga, i: number) => `${i}`;

const styles = ScaledSheet.create({
  textSmall: {
    fontSize: '10@ms',
  },
  textLarge: {
    fontSize: '20@ms',
  },
});

const Appearance: React.FC<ConnectedAppearanceProps> = ({
  title,
  toggleAutoBookHeight,
  autoHeight,
  toggleBoldTitleFont,
  toggleAutoLetterSpacing,
  setBookLetterSpacing,
  setTitleAlignment,
  setBookDimensions,
  width: bookWidth,
  height: bookHeight,
  setTitleFontSize,
  setBookStyle: _setBookStyle,
  style,
}) => {
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({ headerTitle: 'Appearance' });
  const bottomSheet = React.useRef<BottomSheetMethods>(null);
  const { width: screenWidth } = useWindowDimensions();
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
          height.value = widthValue / BOOK_RATIO;
          break;
      }
    },
    [style],
  );
  function handleOnCheckbox() {
    toggleAutoBookHeight();
    autoAdjustHeight(width.value);
  }

  const setBookStyle = React.useCallback(
    (newValue: BookStyle) => {
      if (autoHeight)
        switch (newValue) {
          case BookStyle.TACHIYOMI:
            height.value = width.value / moderateScale(0.66);
            break;
          case BookStyle.CLASSIC:
          case BookStyle.MANGAROCK:
            height.value = width.value / BOOK_RATIO;
            break;
        }
      _setBookStyle(newValue);
    },
    [_setBookStyle, autoHeight],
  );

  function handleOnChangeWidth(v: number) {
    width.value = v;
    if (autoHeight) autoAdjustHeight(v);
  }

  function handleOnChangeHeight(v: number) {
    height.value = v;
  }

  function handleOnChangeFontSize(v: number) {
    fontSize.value = v;
  }

  function handleOnBoldToggle() {
    toggleBoldTitleFont();
  }

  function handleOnToggleLetterSpacing() {
    toggleAutoLetterSpacing();
    letterSpacing.value = -fontSize.value / moderateScale(30);
  }

  function handleOnChangeLetterSpacing(v: number) {
    letterSpacing.value = v;
  }

  function onLibraryPreview() {
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
      setBookLetterSpacing(letterSpacing.value);
      setBookDimensions({ width: width.value, height: height.value });
      setTitleFontSize(fontSize.value);
    };
  }, []);

  return (
    <>
      <ScrollView
        onScroll={onScroll}
        contentContainerStyle={contentContainerStyle}
        style={scrollViewStyle}
      >
        <Stack space="s" my="s">
          <Box mx="m">
            <Text variant="header" bold>
              Manga
            </Text>
          </Box>
          <Box background-color="paper" border-radius="@theme" box-shadow>
            <Box
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
            </Box>
            <Divider />
            <Stack space="s" p="m">
              <Button
                label="Press for library preview"
                onPress={onLibraryPreview}
              />
              <Text bold variant="header">
                Style
              </Text>
              <RadioGroup onChange={setBookStyle} value={style}>
                <Stack space="s" flex-direction="row">
                  <Radio value={BookStyle.CLASSIC} label="Classic" />
                  <Radio value={BookStyle.TACHIYOMI} label="Tachiyomi" />
                  <Radio value={BookStyle.MANGAROCK} label="MangaRock" />
                </Stack>
              </RadioGroup>
              <Text color="textSecondary" variant="book-title">
                Choose a style that best fits your taste
              </Text>
              <Text bold variant="header">
                Cover Image
              </Text>
              <Box>
                <Text>Width</Text>
                <Slider
                  defaultValue={width.value}
                  onChange={handleOnChangeWidth}
                  min={moderateScale(50)}
                  max={moderateScale(200)}
                />
              </Box>
              <Box>
                <Stack flex-direction="row" space="m" align-items="center">
                  <Text>Height</Text>
                  <Box flex-direction="row" align-items="center">
                    <Checkbox
                      checked={autoHeight}
                      onChange={handleOnCheckbox}
                    />
                    <TouchableWithoutFeedback onPress={handleOnCheckbox}>
                      <Text variant="book-title" color="textSecondary">
                        Auto
                      </Text>
                    </TouchableWithoutFeedback>
                  </Box>
                </Stack>

                <Box
                  pointerEvents={autoHeight ? 'none' : 'auto'}
                  opacity={autoHeight ? 0.5 : 1}
                >
                  {!autoHeight && (
                    <Slider
                      defaultValue={height.value}
                      onChange={handleOnChangeHeight}
                      min={50}
                      max={moderateScale(400)}
                    />
                  )}
                </Box>
              </Box>
              <Text bold variant="header">
                Title
              </Text>
              <Text>Alignment</Text>
              <RadioGroup onChange={setTitleAlignment} value={title.alignment}>
                <Stack flex-direction="row" space="s">
                  <Radio value={TitleAlignment.START} label="Left" />
                  <Radio value={TitleAlignment.CENTER} label="Center" />
                  <Radio value={TitleAlignment.END} label="Right" />
                </Stack>
              </RadioGroup>
              <Stack space="s" flex-direction="row" align-items="center">
                <TouchableWithoutFeedback onPress={handleOnBoldToggle}>
                  <Text>Bold font</Text>
                </TouchableWithoutFeedback>
                <Checkbox onChange={handleOnBoldToggle} checked={title.bold} />
              </Stack>
              <Box>
                <Text>Font size</Text>
                <Stack flex-direction="row" space="m" align-items="center">
                  <Text style={styles.textSmall}>abc</Text>
                  <Slider
                    min={moderateScale(10)}
                    max={moderateScale(20)}
                    defaultValue={fontSize.value}
                    onChange={handleOnChangeFontSize}
                  />
                  <Text style={styles.textLarge}>abc</Text>
                </Stack>
              </Box>
              <Box>
                <Stack space="s" flex-direction="row" align-items="center">
                  <Text>Letter spacing</Text>
                  <Box flex-direction="row" align-items="center">
                    <Checkbox
                      checked={title.autoLetterSpacing}
                      onChange={handleOnToggleLetterSpacing}
                    />
                    <TouchableWithoutFeedback
                      onPress={handleOnToggleLetterSpacing}
                    >
                      <Text variant="book-title" color="textSecondary">
                        Auto
                      </Text>
                    </TouchableWithoutFeedback>
                  </Box>
                </Stack>
                {!title.autoLetterSpacing && (
                  <Slider
                    min={-2}
                    max={1}
                    onChange={handleOnChangeLetterSpacing}
                    defaultValue={letterSpacing.value}
                  />
                )}
              </Box>
            </Stack>
          </Box>
          <Text variant="header" bold>
            Theming
          </Text>
        </Stack>
      </ScrollView>
      <CustomBottomSheet
        ref={bottomSheet}
        header={
          <Text variant="header" align="center" bold>
            Preview
          </Text>
        }
      >
        <BottomSheetScrollView>
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
                    bookStyle={style}
                    align={title.alignment}
                    bold={title.bold}
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
        </BottomSheetScrollView>
      </CustomBottomSheet>
    </>
  );
};

export default connector(Appearance);
