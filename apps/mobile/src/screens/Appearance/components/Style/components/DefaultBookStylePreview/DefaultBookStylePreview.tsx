import React from 'react';
import { PreviewBookStyleProps } from '@screens/Appearance/components/Style';
import { BOOK_COVER_HEIGHT, BOOK_DIMENSIONS } from '@theme/constants';
import Stack from '@components/Stack';
import { useTheme } from '@emotion/react';
import { coverStyles } from '@components/Cover/Cover';
import Box from '@components/Box';
import { LinePlaceholder } from '@screens/Appearance/components/Style/Style';
import Text from '@components/Text';
import PreviewSelectorWrapper from '@screens/Appearance/components/Style/components/PreviewSelectorWrapper/PreviewSelectorWrapper';
import { BookStyle } from '@redux/slices/settings';
import Pressable from '@components/Pressable';

const DefaultBookStylePreview: React.FC<PreviewBookStyleProps> = (props) => {
  const { onSelect, isSelected } = props;
  function handleOnPress() {
    onSelect(BookStyle.CLASSIC);
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
          <Pressable onPress={handleOnPress}>
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
                style={coverStyles.image}
              />
              {LinePlaceholder}
              {LinePlaceholder}
            </Stack>
          </Pressable>
        </Stack>
        <Text>Classic</Text>
      </Stack>
    </PreviewSelectorWrapper>
  );
};

export default React.memo(DefaultBookStylePreview);
