import { Typography } from '@components/Typography';
import React from 'react';
import { View } from 'react-native';
import { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { BadgeContainer } from './Badge.base';
import { BadgeProps } from './Badge.interfaces';

const Badge: React.FC<BadgeProps> = (props) => {
  const { children, color = 'secondary', badge, show } = props;
  const scale = useSharedValue(0);

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
      if (show) scale.value = withSpring(1);
      else scale.value = withTiming(0, { duration: 300, easing: Easing.ease });
    }
  }, [badge, show]);

  const styles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View>
      <BadgeContainer color={color} style={styles}>
        <Typography variant='bottomtab'>{badge}</Typography>
      </BadgeContainer>
      {children}
    </View>
  );
};

export default Badge;
