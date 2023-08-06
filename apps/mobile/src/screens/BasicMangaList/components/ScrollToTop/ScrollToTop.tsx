import Box, { AnimatedBox } from '@components/Box';
import { Pressable } from 'react-native';
import type { ScrollToTopProps } from './';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '@emotion/react';
import Icon from '@components/Icon';

export default function ScrollToTop(props: ScrollToTopProps) {
  const { style, onLongPress, onPress } = props;
  const theme = useTheme();
  return (
    <AnimatedBox
      style={style}
      box-shadow
      align-self="flex-end"
      pointerEvents="box-none"
      position="absolute"
      bottom={moderateScale(32)}
      right={moderateScale(32)}
      background-color="primary"
      border-radius={1000}
    >
      <Pressable
        android_ripple={{
          color: theme.palette.primary.ripple,
          borderless: true,
        }}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <Box p="m">
          <Icon
            type="font"
            name="chevron-up"
            size={moderateScale(30)}
            color="primary@contrast"
          />
        </Box>
      </Pressable>
    </AnimatedBox>
  );
}
