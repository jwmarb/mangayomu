import Box from '@components/Box';
import Slider from '@components/Slider';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import { FontSizeProps } from './FontSize.interfaces';

const styles = ScaledSheet.create({
  textSmall: {
    fontSize: '10@ms',
  },
  textLarge: {
    fontSize: '20@ms',
  },
});

const FontSize: React.FC<FontSizeProps> = (props) => {
  const { fontSize, onChangeFontSize } = props;
  return (
    <Box>
      <Text>Font size</Text>
      <Stack flex-direction="row" space="m" align-items="center">
        <Text style={styles.textSmall}>abc</Text>
        <Slider
          min={moderateScale(10)}
          max={moderateScale(20)}
          defaultValue={fontSize.value}
          onChange={onChangeFontSize}
        />
        <Text style={styles.textLarge}>abc</Text>
      </Stack>
    </Box>
  );
};

export default React.memo(FontSize);
