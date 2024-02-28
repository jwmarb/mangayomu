import Box, { AnimatedBox } from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import type { StyleProp, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';

interface AdornmentProps {
  onClearText: () => void;
  isInputEmpty: boolean;
  style: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const right = moderateScale(-8);

export default function Adornment(
  props: React.PropsWithChildren<AdornmentProps>,
) {
  const { children, onClearText, isInputEmpty, style } = props;
  return (
    <Box
      position="absolute"
      right={right}
      align-self="center"
      mr="m"
      flex-direction="row"
      pointerEvents={isInputEmpty ? 'none' : 'auto'}
    >
      {children}
      <AnimatedBox style={style}>
        <IconButton
          icon={<Icon type="font" name="close" />}
          compact
          color="textSecondary"
          onPress={onClearText}
        />
      </AnimatedBox>
    </Box>
  );
}
