import React from 'react';
import { PreviewBookStyleProps } from '@screens/Appearance/components/Style';
import { BOOK_COVER_HEIGHT, BOOK_DIMENSIONS } from '@theme/constants';
import Stack from '@components/Stack';
import { useTheme } from '@emotion/react';
import { coverStyles } from '@components/Cover/Cover';
import Box from '@components/Box';
import { LinePlaceholder } from '@screens/Appearance/components/Style/Style';
import Text from '@components/Text';
import { moderateScale } from 'react-native-size-matters';
import PreviewSelectorWrapper from '@screens/Appearance/components/Style/components/PreviewSelectorWrapper/PreviewSelectorWrapper';
import { BookStyle } from '@redux/slices/settings';
import { StyleSheet } from 'react-native';
import Pressable from '@components/Pressable';

const styles = StyleSheet.create({
  pressable: {
    flexGrow: 1,
  },
});

const TachiyomiBookStylePreview: React.FC<PreviewBookStyleProps> = (props) => {
  const { isSelected, onSelect } = props;
  function handleOnPress() {
    onSelect(BookStyle.TACHIYOMI);
  }
  const theme = useTheme();
  return (
    <PreviewSelectorWrapper isSelected={isSelected}>
      <Stack space="s" overflow="hidden" flex-grow justify-content="center">
        <Box flex-grow border-radius="@theme" overflow="hidden">
          <Pressable style={styles.pressable} onPress={handleOnPress}>
            <Stack
              height={BOOK_DIMENSIONS.height}
              px="m"
              border-color={isSelected ? 'primary' : '@theme'}
              border-width="@theme"
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
                style={coverStyles.image}
                border-color="@theme"
                border-width={moderateScale(2)}
              >
                <Stack space="s" p="s">
                  {LinePlaceholder}
                  {LinePlaceholder}
                </Stack>
              </Box>
            </Stack>
          </Pressable>
        </Box>
        <Text>Tachiyomi</Text>
      </Stack>
    </PreviewSelectorWrapper>
  );
};

export default React.memo(TachiyomiBookStylePreview);
