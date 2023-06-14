import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { InputBase } from '@components/Input/Input.base';
import { useTheme } from '@emotion/react';
import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { InputProps } from './Input.interfaces';
import { moderateScale } from 'react-native-size-matters';

const Input = React.forwardRef<TextInput, InputProps>((props, ref) => {
  const {
    onChangeText = () => void 0,
    icon,
    iconButton,
    defaultValue = '',
    expanded,
    ...rest
  } = props;
  const textRef = React.useRef<TextInput>(null);
  const opacity = useSharedValue(
    defaultValue.length > 0 || (props.value && props.value.length > 0) ? 1 : 0,
  );
  React.useImperativeHandle(ref, () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(textRef.current as any),
    clear: () => {
      handleOnClear();
    },
  }));
  const theme = useTheme();
  function handleOnClear() {
    textRef.current?.clear();
    onChangeText('');
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
      {icon && (
        <Box position="absolute" left={0} align-self="center" ml="m">
          {React.cloneElement(icon, { variant: 'icon-button' })}
        </Box>
      )}

      <InputBase
        iconButton={iconButton}
        icon={icon}
        onChangeText={handleOnChangeText}
        defaultValue={defaultValue}
        expanded={expanded}
        shouldCancelWhenOutside
        {...rest}
        ref={(r) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (textRef as any).current = r;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (ref != null) (ref as any).current = r;
        }}
        placeholderTextColor={theme.palette.text.hint}
      />
      {iconButton && (
        <Box
          left={moderateScale(-8)}
          position="absolute"
          align-self="center"
          ml="s"
        >
          {React.cloneElement(iconButton, { compact: true })}
        </Box>
      )}
      <Box
        position="absolute"
        right={moderateScale(-8)}
        align-self="center"
        mr="m"
      >
        <Animated.View style={style}>
          <IconButton
            icon={<Icon type="font" name="close" />}
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
