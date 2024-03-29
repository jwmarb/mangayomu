import React from 'react';
import { PreviewSelectorWrapperProps } from './PreviewSelectorWrapper.interfaces';
import Box from '@components/Box/Box';
import { moderateScale } from 'react-native-size-matters';
import Icon from '@components/Icon/Icon';
import { useTheme } from '@emotion/react';

const SIZE = moderateScale(30);
const OFFSET = moderateScale(-8);

const PreviewSelectorWrapper: React.FC<PreviewSelectorWrapperProps> = (
  props,
) => {
  const { children, isSelected, background = 'default' } = props;
  const theme = useTheme();
  return (
    <Box>
      {children}
      {isSelected && (
        <Box
          position="absolute"
          right={OFFSET}
          top={OFFSET}
          background-color="primary"
          width={SIZE}
          height={SIZE}
          border-radius={10000}
          align-items="center"
          justify-content="center"
          border-color={theme.palette.background[background]}
          border-width={SIZE / 6}
        >
          <Icon
            type="font"
            name="check-bold"
            color="primary@contrast"
            size={SIZE * 0.5}
          />
        </Box>
      )}
    </Box>
  );
};

export default PreviewSelectorWrapper;
