import Box from '@components/Box';
import Button from '@components/Button';
import IconButton from '@components/IconButton';
import { InputBase } from '@components/Input/Input.base';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { InputProps } from './Input.interfaces';

const Input = React.forwardRef<TextInput, InputProps>((props, ref) => {
  const { onChangeText = () => void 0, ...rest } = props;
  const textRef = React.useRef<TextInput>(null);
  const opacity = useSharedValue(0);
  const theme = useTheme();
  function handleOnClear() {
    textRef.current?.clear();
    opacity.value = 0;
  }
  function handleOnChangeText(t: string) {
    onChangeText(t);
    if (t.length > 0) opacity.value = 1;
    else opacity.value = 0;
  }

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Box flex-direction="row" flex-grow>
      <InputBase
        onChangeText={handleOnChangeText}
        {...rest}
        ref={(r) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (textRef as any).current = r;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (ref != null) (ref as any).current = r;
        }}
        placeholderTextColor={theme.palette.text.hint}
      />
      <Box position="absolute" right={0} align-self="center" mr="m">
        <Animated.View style={style}>
          <IconButton
            name="close"
            compact
            color="textSecondary"
            onPress={handleOnClear}
          />
        </Animated.View>
      </Box>
    </Box>
  );
});

export default Input;
