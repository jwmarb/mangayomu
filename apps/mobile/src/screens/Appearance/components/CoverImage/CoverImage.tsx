import Box from '@components/Box';
import Checkbox from '@components/Checkbox';
import Slider from '@components/Slider';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { CoverImageProps } from './CoverImage.interfaces';
import { useTheme } from '@emotion/react';

const CoverImage: React.FC<CoverImageProps> = (props) => {
  const {
    width,
    height,
    onChangeHeight,
    onChangeWidth,
    autoHeight,
    onToggleAutoHeight,
  } = props;
  const theme = useTheme();
  return (
    <>
      <Box>
        <Text bold variant="header">
          Cover Image
        </Text>
        <Text color="textSecondary">
          Change how manga covers should be displayed
        </Text>
      </Box>
      <Box
        border-radius="@theme"
        background-color="paper"
        py="m"
        px="l"
        border-width="@theme"
        style={{ borderColor: theme.palette.borderColor }}
      >
        <Text>Width</Text>
        <Slider
          defaultValue={width.value}
          onChange={onChangeWidth}
          min={moderateScale(50)}
          max={moderateScale(200)}
        />
        <Stack flex-direction="row" space="m" align-items="center">
          <Text>Height</Text>
          <Box flex-direction="row" align-items="center">
            <Checkbox checked={autoHeight} onChange={onToggleAutoHeight} />
            <TouchableWithoutFeedback onPress={onToggleAutoHeight}>
              <Text variant="book-title" color="textSecondary">
                Auto
              </Text>
            </TouchableWithoutFeedback>
          </Box>
        </Stack>
        <Box>
          {!autoHeight && (
            <Slider
              defaultValue={height.value}
              onChange={onChangeHeight}
              min={50}
              max={moderateScale(400)}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default React.memo(CoverImage);
