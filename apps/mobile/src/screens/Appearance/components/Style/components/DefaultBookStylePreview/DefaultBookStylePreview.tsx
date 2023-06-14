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
import Badge from '@components/Badge/Badge';
import PreviewSelectorWrapper from '@screens/Appearance/components/Style/components/PreviewSelectorWrapper/PreviewSelectorWrapper';
import Icon from '@components/Icon/Icon';
import { BaseButton, BorderlessButton } from 'react-native-gesture-handler';
import { BookStyle } from '@redux/slices/settings';

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
          style={{
            borderColor: isSelected
              ? theme.palette.primary.main
              : theme.palette.borderColor,
          }}
          border-width={RADIO_BUTTON_BORDER_WIDTH}
        >
          <BaseButton
            onPress={handleOnPress}
            rippleColor={theme.palette.action.ripple}
            style={{ borderRadius: theme.style.borderRadius }}
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
                style={coverStyles.image}
              />
              {LinePlaceholder}
              {LinePlaceholder}
            </Stack>
          </BaseButton>
        </Stack>
        <Text>Classic</Text>
      </Stack>
    </PreviewSelectorWrapper>
  );
};

export default React.memo(DefaultBookStylePreview);
