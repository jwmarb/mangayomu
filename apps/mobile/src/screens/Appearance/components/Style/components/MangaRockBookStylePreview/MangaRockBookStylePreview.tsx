import React from 'react';
import { PreviewBookStyleProps } from '@screens/Appearance/components/Style';
import {
  BOOK_COVER_HEIGHT,
  BOOK_DIMENSIONS,
  RADIO_BUTTON_BORDER_WIDTH,
} from '@theme/constants';
import Stack from '@components/Stack';
import { useTheme } from '@emotion/react';
import { coverStyles } from '@components/Cover/Cover';
import Box from '@components/Box';
import { LinePlaceholder } from '@screens/Appearance/components/Style/Style';
import Text from '@components/Text';
import { BaseButton } from 'react-native-gesture-handler';
import PreviewSelectorWrapper from '@screens/Appearance/components/Style/components/PreviewSelectorWrapper';
import { BookStyle } from '@redux/slices/settings';
import { Pressable } from 'react-native';

const MangaRockBookStylePreview: React.FC<PreviewBookStyleProps> = (props) => {
  const { isSelected, onSelect } = props;
  function handleOnPress() {
    onSelect(BookStyle.MANGAROCK);
  }
  const theme = useTheme();
  return (
    <PreviewSelectorWrapper isSelected={isSelected}>
      <Stack space="s">
        <Stack
          flex-shrink
          space="s"
          border-radius="@theme"
          border-color={isSelected ? 'primary' : '@theme'}
          border-width="@theme"
          overflow="hidden"
        >
          <Pressable
            onPress={handleOnPress}
            android_ripple={{ color: theme.palette.action.ripple }}
          >
            <Stack
              m="m"
              justify-content="center"
              height={BOOK_DIMENSIONS.height}
              space="s"
            >
              <Box
                width={BOOK_DIMENSIONS.width}
                height={BOOK_COVER_HEIGHT}
                background-color={theme.palette.skeleton}
              />
              {LinePlaceholder}
              {LinePlaceholder}
            </Stack>
          </Pressable>
        </Stack>
        <Text>MangaRock</Text>
      </Stack>
    </PreviewSelectorWrapper>
  );
};

export default React.memo(MangaRockBookStylePreview);
