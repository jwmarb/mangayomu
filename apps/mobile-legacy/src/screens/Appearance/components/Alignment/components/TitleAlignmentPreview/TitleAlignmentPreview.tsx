import Box from '@components/Box';
import { coverStyles } from '@components/Cover/Cover';
import Pressable from '@components/Pressable';
import Stack from '@components/Stack';
import Text from '@components/Text/Text';
import { useAppDispatch } from '@redux/main';
import { setTitleAlignment } from '@redux/slices/settings';
import { TitleAlignmentPreviewProps } from '@screens/Appearance/components/Alignment';
import { LinePlaceholder } from '@screens/Appearance/components/Style/Style';
import PreviewSelectorWrapper from '@screens/Appearance/components/Style/components/PreviewSelectorWrapper/PreviewSelectorWrapper';
import { BOOK_DIMENSIONS } from '@theme/constants';
import React from 'react';

const TitleAlignmentPreview: React.FC<TitleAlignmentPreviewProps> = (props) => {
  const { isSelected, alignItems = 'flex-start', titleAlignment } = props;
  const dispatch = useAppDispatch();
  function handleOnPress() {
    dispatch(setTitleAlignment(titleAlignment));
  }
  return (
    <PreviewSelectorWrapper isSelected={isSelected} background="paper">
      <Stack space="s">
        <Box border-radius="@theme" overflow="hidden">
          <Pressable onPress={handleOnPress}>
            <Stack
              border-color={isSelected ? 'primary' : '@theme'}
              border-width="@theme"
              border-radius="@theme"
              px="m"
              pb="m"
              space="s"
            >
              <Box
                width={BOOK_DIMENSIONS.width}
                height={BOOK_DIMENSIONS.height / 5}
                background-color="skeleton"
                style={coverStyles.image}
                border-radius={{ tr: 0, tl: 0 }}
              />
              <Stack space="s">
                <Box
                  maxWidth="90%"
                  flex-direction="row"
                  align-self={alignItems}
                >
                  {LinePlaceholder}
                </Box>
                <Box
                  maxWidth="70%"
                  flex-direction="row"
                  align-self={alignItems}
                >
                  {LinePlaceholder}
                </Box>
              </Stack>
            </Stack>
          </Pressable>
        </Box>
        <Text>{titleAlignment[0].toUpperCase() + titleAlignment.slice(1)}</Text>
      </Stack>
    </PreviewSelectorWrapper>
  );
};

export default React.memo(TitleAlignmentPreview);
