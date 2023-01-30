import { useBadgeLayoutAnimation } from '@components/Badge/Badge.helpers';
import Box from '@components/Box';
import Text from '@components/Text';
import React from 'react';
import Animated from 'react-native-reanimated';
import { ScaledSheet } from 'react-native-size-matters';
import { NumberBadgeProps } from './Badge.interfaces';

const NumberBadge: React.FC<NumberBadgeProps> = (props) => {
  const { children, count, color = 'textPrimary', show } = props;
  const style = useBadgeLayoutAnimation(show == null ? !!count : show);
  const animatedStyle = React.useMemo(
    () => [style, styles.numberBadge],
    [style, styles.numberBadge],
  );
  return (
    <Box>
      {children}
      <Box as={Animated.View} style={animatedStyle} background-color={color}>
        <Text variant="badge" bold contrast color={color}>
          {count}
        </Text>
      </Box>
    </Box>
  );
};

const styles = ScaledSheet.create({
  numberBadge: {
    position: 'absolute',
    top: '4@ms',
    right: '4@ms',
    width: '16@ms',
    height: '16@ms',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    borderColor: 'transparent',
  },
});

export default NumberBadge;
