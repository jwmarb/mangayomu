import React from 'react';
import { PageCounterProps } from './PageCounter.interfaces';
import { useTheme } from '@emotion/react';
import { moderateScale } from 'react-native-size-matters';
import { OVERLAY_COLOR, OVERLAY_TEXT_PRIMARY } from '@theme/constants';
import Text from '@components/Text';
import { AnimatedBox } from '@components/Box';
import { FadeInDown } from 'react-native-reanimated';

const PageCounter: React.FC<PageCounterProps> = (props) => {
  const { page, pageCounterStyle, totalPages } = props;
  const theme = useTheme();
  if (!totalPages || !page) return null;
  return (
    <AnimatedBox
      entering={FadeInDown}
      style={pageCounterStyle}
      position="absolute"
      bottom={theme.style.spacing.xl}
      background-color={OVERLAY_COLOR}
      align-self="center"
      py={moderateScale(2)}
      px="s"
      border-radius={moderateScale(4)}
    >
      <Text bold variant="badge" color={OVERLAY_TEXT_PRIMARY}>
        {page} / {totalPages}
      </Text>
    </AnimatedBox>
  );
};

export default PageCounter;
