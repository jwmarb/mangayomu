import React from 'react';
import { PreviewBookStyleProps } from '@screens/Appearance/components/Style/Style.interfaces';
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
import { moderateScale } from 'react-native-size-matters';
import PreviewSelectorWrapper from '@screens/Appearance/components/Style/components/PreviewSelectorWrapper/PreviewSelectorWrapper';
import { BaseButton } from 'react-native-gesture-handler';
import { BookStyle } from '@redux/slices/settings';
import Icon from '@components/Icon';

const TachiyomiBookStylePreview: React.FC<PreviewBookStyleProps> = (props) => {
  const { isSelected, onSelect } = props;
  function handleOnPress() {
    onSelect(BookStyle.TACHIYOMI);
  }
  const theme = useTheme();
  return (
    <PreviewSelectorWrapper isSelected={isSelected}>
      <Stack space="s" flex-grow border-radius="@theme">
        <BaseButton
          onPress={handleOnPress}
          style={{
            borderRadius: theme.style.borderRadius,
            flexGrow: 1,
          }}
        >
          <Stack
            px="m"
            style={{
              borderColor: isSelected
                ? theme.palette.primary.main
                : theme.palette.borderColor,
            }}
            border-width={RADIO_BUTTON_BORDER_WIDTH}
            border-radius="@theme"
            flex-grow
            space="s"
            justify-content="center"
          >
            <Box
              justify-content="flex-end"
              width={BOOK_DIMENSIONS.width}
              height={BOOK_COVER_HEIGHT}
              background-color={theme.palette.skeleton}
              style={[
                coverStyles.image,
                { borderColor: theme.palette.borderColor },
              ]}
              border-width={moderateScale(2)}
            >
              <Stack space="s" p="s">
                {LinePlaceholder}
                {LinePlaceholder}
              </Stack>
            </Box>
          </Stack>
        </BaseButton>
        <Text>Tachiyomi</Text>
      </Stack>
    </PreviewSelectorWrapper>
  );
};

export default React.memo(TachiyomiBookStylePreview);
