import { Typography } from '@components/Typography';
import { Color } from '@theme/core';
import React from 'react';
import { View } from 'react-native';
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';
import { BadgeContainer } from './Badge.base';
import { BadgeProps } from './Badge.interfaces';

const Badge: React.FC<React.PropsWithChildren<BadgeProps>> = (props) => {
  const { children, color = 'secondary', badge, show } = props;
  const scale = useSharedValue(show === undefined ? (typeof badge === 'number' && badge === 0 ? 0 : 1) : show ? 1 : 0);

  React.useEffect(() => {
    if (show === undefined)
      if (typeof badge === 'number') {
        switch (badge) {
          case 0:
            scale.value = withTiming(0, { duration: 300, easing: Easing.ease });
            break;
          default:
            scale.value = withSpring(1);
            break;
        }
      } else scale.value = withSpring(1);
    else {
      if (show) scale.value = withSpring(badge === undefined ? 0.334 : 1);
      else scale.value = withTiming(0, { duration: 300, easing: Easing.ease });
    }
    return () => {
      cancelAnimation(scale);
    };
  }, [badge, show]);

  const styles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View>
      <BadgeContainer color={color} style={styles}>
        <Typography variant='bottomtab' color={Color.getContrastText(color)}>
          {badge}
        </Typography>
      </BadgeContainer>
      {children}
    </View>
  );
};

export default Badge;
