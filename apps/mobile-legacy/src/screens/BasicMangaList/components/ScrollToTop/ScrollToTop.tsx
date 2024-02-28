import Box, { AnimatedBox } from '@components/Box';
import type { ScrollToTopProps } from './';
import { moderateScale } from 'react-native-size-matters';
import Icon from '@components/Icon';
import Pressable from '@components/Pressable';

export default function ScrollToTop(props: ScrollToTopProps) {
  const { style, onLongPress, onPress } = props;
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
      <Pressable borderless onPress={onPress} onLongPress={onLongPress}>
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
