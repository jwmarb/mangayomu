import Radio from '@components/Radio';
import RadioGroup from '@components/RadioGroup';
import Stack from '@components/Stack';
import Text from '@components/Text';
import {
  BookStyle,
  setBookStyle as _setBookStyle,
} from '@redux/slices/settings';
import React from 'react';
import Box from '@components/Box/Box';
import { useTheme } from '@emotion/react';
import { moderateScale } from 'react-native-size-matters';
import { BOOK_COVER_HEIGHT, BOOK_DIMENSIONS } from '@theme/constants';
import { coverStyles } from '@components/Cover/Cover';
import Skeleton from '@components/Skeleton/Skeleton';
import { ScrollView } from 'react-native-gesture-handler';
import DefaultBookStylePreview from '@screens/Appearance/components/Style/components/DefaultBookStylePreview/DefaultBookStylePreview';
import TachiyomiBookStylePreview from '@screens/Appearance/components/Style/components/TachiyomiBookStylePreview/TachiyomiBookStylePreview';
import MangaRockBookStylePreview from '@screens/Appearance/components/Style/components/MangaRockBookStylePreview/MangaRockBookStylePreview';
import { useAppDispatch } from '@redux/main';
import useAppSelector from '@hooks/useAppSelector';
import { BookStyleProps } from '@screens/Appearance/components/Style';

export const LinePlaceholder = (
  <Skeleton fullWidth height={moderateScale(10)} />
);
const Style: React.FC<BookStyleProps> = ({ setBookStyle }) => {
  const style = useAppSelector((state) => state.settings.book.style);

  return (
    <>
      <Box pt="m" px="m">
        <Text bold variant="header">
          Style
        </Text>
        <Text color="textSecondary">
          Customize how manga is displayed on screen
        </Text>
      </Box>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Stack flex-direction="row" space="m" my="s" px="m">
          <DefaultBookStylePreview
            isSelected={style === BookStyle.CLASSIC}
            onSelect={setBookStyle}
          />
          <TachiyomiBookStylePreview
            isSelected={style === BookStyle.TACHIYOMI}
            onSelect={setBookStyle}
          />
          <MangaRockBookStylePreview
            isSelected={style === BookStyle.MANGAROCK}
            onSelect={setBookStyle}
          />
        </Stack>
      </ScrollView>
    </>
  );
};

export default Style;
