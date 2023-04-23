import { BadgeLocation } from '@components/Badge';
import {
  generateBadgePlacement,
  useBadgeLayoutAnimation,
} from '@components/Badge/Badge.helpers';
import Box, { AnimatedBox } from '@components/Box';
import Text from '@components/Text';
import React from 'react';
import { ScaledSheet } from 'react-native-size-matters';
import { NumberBadgeProps } from './Badge.interfaces';

const NumberBadge: React.FC<NumberBadgeProps> = (props) => {
  const { children, count, color = 'textPrimary', show, placement } = props;
  const style = useBadgeLayoutAnimation(
    show == null ? !!count : show,
    placement,
  );
  const animatedStyle = React.useMemo(
    () => [style, styles.numberBadge],
    [style, styles.numberBadge],
  );
  return (
    <Box>
      {children}
      <AnimatedBox style={animatedStyle} background-color={color}>
        <Text variant="badge" bold contrast color={color}>
          {count}
        </Text>
      </AnimatedBox>
    </Box>
  );
};

const styles = ScaledSheet.create({
  numberBadge: {
    position: 'absolute',

    width: '16@ms',
    height: '16@ms',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    borderColor: 'transparent',
  },
});

export default NumberBadge;
